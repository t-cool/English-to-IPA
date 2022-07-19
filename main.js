const requestURL = "https://t-cool.github.io/English-to-IPA/dict.json";
const request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'text';
request.send();

const voice = new talkify.Html5Player();
voice.forceLanguage('en');
voice.setRate(1);

request.onload = function

() {
// DB
let asset = JSON.parse(request.response);
asset = asset[0];

// 補助関数
function remove_punc(words){
  let words_preserved = [];
  words = words.split(" ");
  for (w of words) {
    lowerWord = w.toLowerCase();
    let punct_str = lowerWord.replace(/\!|\"|\#|\$|\%|\&|\\|\'|\(|\)|\*|\+|\,|\-|\.|\/|\:|\;|\<|\=|\>|\/|\?|\@|\[|\\|\\|\]|\^|\_|\`|\{|\||\}|\~|\«|\»|\ /g, '');
    words_preserved.push([w, punct_str]);
  }
  return words_preserved
}

function get_cmu(words_array){
  // [['He', 'he'],['is', 'is'] ]
  let words_array2 = words_array;

  let fetched_words = [];
  words_array.forEach((wordArray)=>{
    if(asset[wordArray[1]]){
      fetched_words.push([wordArray[0], [asset[wordArray[1]]]]);
    }else{
      fetched_words.push([wordArray[0], [[`"${wordArray[0]}"`]]]);
    }
  })
  return fetched_words;
}

function cmu_to_ipa(cmu_list){
  let symbols = {"a": "ə", "ey": "eɪ", "aa": "ɑ", "ae": "æ", "ah": "ʌ", "ao": "ɔ", "aw": "aʊ", "ay": "aɪ", "ch": "tʃ", "dh": "ð", "eh": "ɛ", "er": "ər", "hh": "h", "ih": "ɪ", "jh": "dʒ", "ng": "ŋ",  "ow": "oʊ", "oy": "ɔɪ", "sh": "ʃ", "th": "θ", "uh": "ʊ", "uw": "u", "zh": "ʒ", "iy": "iː", "y": "j"};

  let cmu_list1 = [];
  let cmu_list2 = [];
  let final_list = [];

  final_list = [];
  // 発音記号に置き換える
  cmu_list.forEach((arr)=>{
    cmu_list1 = arr.slice(0,1);
    cmu_list2 = arr.slice(1,2);
    
    let acc = [];
    cmu_list2.forEach((arr2)=>{
      arr2.forEach((syllables) => {  
        syllables = syllables.toString();
        // syllables => 'aa r'
        let arr3 = syllables.split(" ");
        // arr3 => ['aa', 'r']
        let syllableIPA = [];
        arr3.forEach((syllable)=>{

          if(symbols[syllable]){
            syllableIPA.push(symbols[syllable]);
          }else{;
            syllableIPA.push(syllable);
          }
        })
        acc.push(syllableIPA.join("").toString().split(","));
      });
    })
    final_list.push([cmu_list1, acc]);
  })
  
  return final_list
}

// main 関数
function convert(words_in){
  // 文字列を配列の形式に変換する
  let words_array = remove_punc(words_in);
  // =>　[['He', 'he'],['is', 'is'] ]

  // DB に単語を問い合わせ、音素を返す
  let cmu_words_array = get_cmu(words_array);
  console.log(cmu_words_array);
  // =>　[['Are',['aa r', 'er']], ['you', ['y uw']], ]

  // 音素を IPA 形式に変換
  let ipa_words_array = cmu_to_ipa(cmu_words_array);
  // =>　[['ɑr', 'ər'], ['ju'], ['bɑb'], ['lʊk']]
  return ipa_words_array
}

// UI
document.getElementById("convert").addEventListener('click',(e)=>{
  let inputText = document.querySelector("#text").value;
  let converted_data = convert(inputText);
  for (wordIPA of converted_data){
    makeBox(wordIPA[0][0],wordIPA[1][0]);
  }
  hideElements(); 
})

function makeBox(word, sounds){
  const boxDom = document.createElement("form");
  boxDom.className = "item";
  containerB.appendChild(boxDom);

  const wordDom = document.createElement("div");

  // ここの単語
  wordDom.innerText = word;
  boxDom.appendChild(wordDom);

  // 選択肢
  const soundsDom = document.createElement("select");
  sounds.map(value => soundsDom.append(new Option(value)));

  boxDom.appendChild(soundsDom);
  boxDom.addEventListener('click',function(e){
    //読み上げ
    voice.playText(word);
  })
}

function hideElements(){
  document.getElementById("caption").style.display = "none";
  document.getElementById("convert").style.display = "none";
  document.getElementById("text").style.display = "none";
}

}

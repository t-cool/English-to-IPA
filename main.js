const requestURL = "https://t-cool.github.io/English-to-IPA/dict.json";
const request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'text';
request.send();

request.onload = function() {
// データベース
let asset = JSON.parse(request.response);
asset = asset[0];

function remove_punc(words){
  // 単語をIPAに変換し、単語の前後にある句読点を取り除く
  let words_preserved = [];
  words = words.split(" ");
  for (w of words) {
    w = w.toLowerCase();
    let punct_str = w.replace(/\!|\"|\#|\$|\%|\&|\\|\'|\(|\)|\*|\+|\,|\-|\.|\/|\:|\;|\<|\=|\>|\/|\?|\@|\[|\\|\\|\]|\^|\_|\`|\{|\||\}|\~|\«|\»|\ /g, '');
    words_preserved.push(punct_str);
  }
  return words_preserved
}

function get_cmu(words_array){
  let fetched_words = [];
  words_array.forEach((word)=>{
    if(asset[word]){
      fetched_words.push([word, [asset[word]]]);
    }else{
      fetched_words.push([word, [[`"${word}"`]]]);
    }
  })
  return fetched_words;
}

// console.log(
//   get_cmu(['to'])
// )
function cmu_to_ipa(cmu_list){

  let symbols = {"a": "ə", "ey": "eɪ", "aa": "ɑ", "ae": "æ", "ah": "ʌ", "ao": "ɔ", "aw": "aʊ", "ay": "aɪ", "ch": "ʧ", "dh": "ð", "eh": "ɛ", "er": "ər", "hh": "h", "ih": "ɪ", "jh": "ʤ", "ng": "ŋ",  "ow": "oʊ", "oy": "ɔɪ", "sh": "ʃ", "th": "θ", "uh": "ʊ", "uw": "u", "zh": "ʒ", "iy": "iː", "y": "j"};

  // 引数の cmu_list
  // => ["to", ['t uw', 't ah']]
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

// console.log(remove_punc("to the"));
// console.log(get_cmu(['to', 'the']));
// console.log(cmu_to_ipa([
//                         ["to",['t uw','t ah'] ],
//                         ["the",['dh ah'] ]
//                        ]));
// console.log(convert("He went to Osakaa"));
function convert(words_in){
  // 文字列を配列の形式に変換する
  let words_array = remove_punc(words_in);
  // =>　['are', 'you', 'okay', 'bob', 'look']

  // DB に単語を問い合わせ、音素を返す
  let cmu_words_array = get_cmu(words_array);
  // console.log(cmu_words_array);
  // =>　[['aa r', 'er'], ['y uw'], ]

  // 音素を IPA 形式に変換
  let ipa_words_array = cmu_to_ipa(cmu_words_array);
  // =>　[['ɑr', 'ər'], ['ju'], ['bɑb'], ['lʊk']]

  return ipa_words_array
}

document.getElementById("convert").addEventListener('click',(e)=>{
  console.log("btn");
  let inputText = document.querySelector("#text").value;
  document.querySelector("#text").value = convert(inputText.toString());
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
}

function hideElements(){
  caption.style.display = "none";
  convert.style.display = "none";
  text.style.display = "none";
}



}

# 開発用のメモ

**元の Python パッケージの動作確認**

```bash
$ python --version
Python 3.8.12
$ python          
>>> import eng_to_ipa as ipa
>>> ipa.convert("I went to Osaka last summer.")
'aɪ wɛnt tɪ oʊsɑkə læst səmər'
```

**porting の方針**

**ビジネスロジック**

- `transcribe.py` のみを porting する。

**UI**

- 英語の文章を Textarea に貼り付けて、一括で発音記号を付与する。

- 文章を英単語に分割し、単語ごとに発音記号を下に表示する。

- 一つの単語につき複数の発音がある場合を想定し、プルダウンボックスで他の候補を表示する。

- 発音指導がしやすいように、一文ごとに改行する。

**デプロイ**

- GitHub Pages で利用できるようにする。
https://t-cool.github.io/English-to-IPA/

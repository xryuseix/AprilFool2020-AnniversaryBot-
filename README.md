# Project Title

AnniversaryBot

恋人ができたそこのあなた！○○ヶ月記念日とかすぐ忘れせんか？
なので記念日になったら自動で通知してくれるLINEbotを作りました！

## Getting Started / スタートガイド

### Prerequisites / 必要条件

GAS上で実行します
LINE developer アカウントが必要です．

### Installing / インストール

```
$ git clone https://github.com/xryuseix/AprilFool2020-AnniversaryBot-
```

その後，当ソースコードをGAS上に貼り付けます．webhookの設定なども行ってください．
その後，以下の環境変数を設定します．

```
CALENDAR_ID : GoogleカレンダーのID
XRYUSEIX_USER_ID : 自分のLINEのID
LINE_ACCESS_TOKEN : LINEbotのアクセストークン
```

その後，`dailyCheck`関数を定期実行させます．


## How to use / 使用方法

LINEで以下のコマンドを使用します

```
登録 XXX : XXXを記念日として登録します．登録されるのは(100,200...900日),(1,2,...11ヶ月),(1,2,...9年),(10,20,...50年)記念です．
今週 : 今週の記念日一覧を表示します．
```

## Contributing / コントリビューション

私たちのコーディング規範とプルリクエストの手順についての詳細は [CONTRIBUTING.md](./.github/CONTRIBUTING.md) を参照してください。

Please read [CONTRIBUTING.md](./.github/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors / 著者

* **[xryuseix](https://github.com/xryuseix)**

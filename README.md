# くらしの相棒

献立表・ゴミ出しリマインダー・割り勘計算機・サブスク管理・駐車位置メモを1本にまとめたアプリ。
PWA(Progressive Web App)対応済みで、スマートフォンのホーム画面にアプリとしてインストールできます。

公開URL: https://shinchanbaseball0402-oss.github.io/kurashi-app/

## スマートフォンへのインストール方法

### iPhone(Safari)

1. Safariで上記の公開URLを開く
2. 画面下の共有ボタン(□に↑が付いたアイコン)をタップ
3. メニューを下にスクロールし「ホーム画面に追加」をタップ
4. 表示名が「くらしの相棒」になっていることを確認し、右上の「追加」をタップ
5. ホーム画面にアイコンが追加され、タップするとアプリのように起動する(Safariのアドレスバーは表示されない)

### Android(Chrome)

1. Chromeで公開URLを開く
2. 右上の「⋮」メニューをタップ
3. 「アプリをインストール」または「ホーム画面に追加」をタップ
4. 表示される名前が「くらしの相棒」であることを確認してインストール

### 注意点

- 一度インストールした後にサイトを更新した場合、アプリを完全に閉じて再度開くと最新版に更新されます(裏側でService Workerが自動更新)。
- 電波の届かない場所でも、直前まで開いていた画面はキャッシュから表示されます(完全なオフライン編集には対応していません)。
- 各ツールの入力データ(献立の割り当て、ゴミの種類、サブスク一覧、駐車メモなど)はこれまで通りブラウザのlocalStorageに保存され、インストールしても消えません。

## GitHub Pagesへのデプロイ(このリポジトリの公開方法)

1. GitHubリポジトリ `kurashi-app` の Settings → Pages を開く
2. Source を「Deploy from a branch」、Branch を `main` / `/(root)` に設定して Save
3. 数分後に `https://shinchanbaseball0402-oss.github.io/kurashi-app/` で公開される
4. `index.html`・`manifest.webmanifest`・`service-worker.js`・`icons/`・`apple-touch-icon.png` などは**すべて相対パス**で参照しているため、`/kurashi-app/` のようなサブディレクトリ配信でもそのまま正しく動作する

※ GitHub PagesはHTML/CSS/JSなどの静的ファイルのみを配信でき、`api/generate-menu.js`(AI献立生成)のようなサーバー処理は実行できない。AI機能を使うには、下記のVercelなど別のサービスに `api/` フォルダをホストする必要がある(未設定でも他の4機能・献立表の手動シャッフルは問題なく動作する)。

## デプロイ手順(Vercel・AI機能を使う場合)

1. このフォルダをGitHubリポジトリにpush(またはVercel CLIで直接デプロイ)。
2. https://vercel.com で新規プロジェクトとしてインポート。ビルド設定不要(静的HTML + `api/`フォルダのEdge Functionを自動認識)。
3. Vercelプロジェクトの Settings → Environment Variables で以下を追加:
   - `ANTHROPIC_API_KEY` = Anthropicコンソール(console.anthropic.com)で発行したAPIキー
4. 再デプロイすると、献立表タブの「🤖 AIで新しい献立」が実際にAIで生成されるようになる。

### コストを抑えるために

- Anthropicコンソールの Settings → Billing で**利用上限(スペンドリミット)**を必ず設定する。
- 生成1回あたり `max_tokens: 1024` に制限済み(コスト上限あり)。
- 本格運用前に、簡単な回数制限(例: 1日1回まで)をサーバー側に追加することを推奨(現時点では未実装)。

### AIが使えなくても動く

`ANTHROPIC_API_KEY` を設定しなくても、アプリ自体は完全に動作する(定番メニュー8品のプールにフォールバック)。まずはAPIキーなしでデプロイして動作確認し、あとからAI機能を有効化できる。

## App Store提出に向けて(Capacitor)

```bash
npm init -y
npm install @capacitor/core @capacitor/cli
npx cap init "くらしの相棒" "com.yourcompany.kurashi"
npx cap add ios
npx cap copy
npx cap open ios
```

- Xcodeが開くので、アプリアイコン(以前作成した4種のSVGを参考に1つに統合したものを推奨)・スプラッシュ画面を設定。
- ビルド・実機確認後、Apple Developer Program(年間$99)に登録し、App Store Connectからアプリを申請。
- 審査ガイドライン4.3(スパム)対策として、複数の薄いアプリではなく本アプリのように1本にまとめて提出すること。

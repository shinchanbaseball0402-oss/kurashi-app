# kurashi-app
# くらしの相棒

献立表・ゴミ出しリマインダー・割り勘計算機・サブスク管理・駐車位置メモを1本にまとめたアプリ。

## デプロイ手順(Vercel)

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

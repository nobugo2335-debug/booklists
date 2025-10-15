/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.jsが環境変数を読み込むための特別な設定は通常不要ですが、
  // Codespace環境で確実に動作させるため、明示的に設定することが有効な場合があります。
  // ただし、Next.jsはデフォルトで.env.localを読み込むため、ここでは最小限の設定に留めます。
  // 必要であれば、ここに 'serverRuntimeConfig'などを追加します。
};

module.exports = nextConfig;
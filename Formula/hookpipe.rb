class Hookpipe < Formula
  desc "Never miss a webhook. Open-source webhook infrastructure on Cloudflare Workers."
  homepage "https://github.com/hookpipe/hookpipe"
  url "https://registry.npmjs.org/hookpipe/-/hookpipe-0.1.0.tgz"
  sha256 "f0e4ad5265488acd28b4f9adaba47ab3fa8a23c73ae1ec5d97e277324c61a322"
  license "Apache-2.0"

  depends_on "node@22"

  def install
    system "npm", "install", *std_npm_args
    bin.install_symlink libexec/"bin/hookpipe"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/hookpipe --version")
    assert_match "ok", shell_output("#{bin}/hookpipe health --json 2>&1 || true")
  end
end

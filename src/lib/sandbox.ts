// /app/lib/sandbox.js
import { VMScript, NodeVM } from 'vm2';

// サンドボックス化された実行環境を提供する関数
export async function executeCodeSafely(code) {
  const vm = new NodeVM({
    console: 'redirect',  // console.logをリダイレクト
    sandbox: {},          // サンドボックス
  });

  // サンドボックス内でコードを実行
  const result = vm.run(code);

  return result;
}

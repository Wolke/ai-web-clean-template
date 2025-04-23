/**
 * 狼人殺遊戲測試模組
 * 提供各種測試函式，讓開發者能夠快速測試狼人殺遊戲的功能
 */
import { runWerewolfTest, TestWorkflow } from './testWorkflow.js';

// 匯出測試工具
export { runWerewolfTest, TestWorkflow };

// 建立測試函式
export const werewolfTests = {
  // 執行完整測試流程
  runFullTest: async (enableAI = true) => {
    console.log('%c開始執行完整狼人殺測試流程...', 'color: #0099ff; font-weight: bold;');
    
    // 先測試 AI 啟用功能
    console.log('%c===== 第一步：測試 AI 設定功能 =====', 'color: #ff6600; font-weight: bold;');
    werewolfTests.testAIEnabled();
    
    // 再執行標準測試流程
    console.log('%c===== 第二步：測試標準遊戲功能 =====', 'color: #ff6600; font-weight: bold;');
    const standardTestResult = await runWerewolfTest();
    
    // 特別執行一次帶有 AI 設定的測試
    console.log('%c===== 第三步：測試帶有 AI 的遊戲功能 =====', 'color: #ff6600; font-weight: bold;');
    console.log(`%c執行${enableAI ? '啟用' : '停用'} AI 的遊戲流程測試...`, 'color: #9966ff;');
    
    const tester = new TestWorkflow();
    tester.initializeGame();
    
    // 根據參數設定 AI 功能
    tester.game.setAIEnabled(enableAI);
    console.log(`%c✓ 已${enableAI ? '啟用' : '停用'} AI 功能進行測試`, 'color: #00cc66;');
    
    // 設置自動回答
    tester.addAutoAnswer('6'); // 玩家數量
    tester.addAutoAnswer(`AI${enableAI ? '啟用' : '停用'}測試者`); // 玩家名稱
    
    // 測試 AI 啟用狀態是否正確
    if (tester.game.settings.useAI === enableAI) {
      console.log(`%c✓ 遊戲已正確設定 AI ${enableAI ? '啟用' : '停用'}狀態`, 'color: #00cc66;');
    } else {
      console.error(`❌ 遊戲 AI 設定狀態不正確，應為 ${enableAI ? '啟用' : '停用'}`);
    }
    
    console.log('%c完整測試流程（含 AI 功能）完成！', 'color: #00cc66; font-weight: bold;');
    return { standardTestResult, aiEnabled: tester.game.settings.useAI };
  },
  
  // 測試遊戲設置
  testGameSetup: async () => {
    console.log('%c測試遊戲設置...', 'color: #0099ff; font-weight: bold;');
    const tester = new TestWorkflow();
    tester.initializeGame();
    
    // 設置自動回答
    tester.addAutoAnswer('6'); // 玩家數量
    tester.addAutoAnswer('測試者'); // 玩家名稱
    
    // 只執行設置階段
    await tester.game.setupInitialGame();
    
    console.log('%c遊戲設置測試完成！', 'color: #00cc66; font-weight: bold;');
    return tester.game;
  },
  
  // 測試 API 連線
  testApiConnection: async () => {
    console.log('%c測試 API 連線...', 'color: #0099ff; font-weight: bold;');
    const tester = new TestWorkflow();
    tester.initializeGame();
    
    // 模擬 API 連線測試
    const result = await tester.apiManager.testApiConnection();
    
    console.log(`%cAPI 連線測試結果: ${result.success ? '成功' : '失敗'}`, 
      result.success ? 'color: #00cc66; font-weight: bold;' : 'color: #ff3300; font-weight: bold;');
    
    return result;
  },
  
  // 測試角色分配
  testRoleDistribution: () => {
    console.log('%c測試角色分配...', 'color: #0099ff; font-weight: bold;');
    const tester = new TestWorkflow();
    tester.initializeGame();
    
    // 建立模擬玩家
    tester.game.players = [];
    for (let i = 1; i <= 8; i++) {
      tester.game.players.push({
        id: i,
        name: `測試玩家${i}`,
        isHuman: i === 1,
        isAlive: true,
        role: null,
        abilities: {},
        history: []
      });
    }
    
    // 執行角色分配
    tester.game.assignRoles();
    
    // 統計角色分佈
    const roleCounts = {};
    tester.game.players.forEach(player => {
      if (!roleCounts[player.role]) {
        roleCounts[player.role] = 0;
      }
      roleCounts[player.role]++;
    });
    
    console.log('%c角色分配結果:', 'color: #9966ff;');
    for (const [role, count] of Object.entries(roleCounts)) {
      console.log(`%c${role}: ${count} 人`, 'color: #ccccff;');
    }
    
    console.log('%c角色分配測試完成！', 'color: #00cc66; font-weight: bold;');
    return roleCounts;
  },
  
  // 測試遊戲結束條件
  testGameOver: () => {
    console.log('%c測試遊戲結束條件...', 'color: #0099ff; font-weight: bold;');
    const tester = new TestWorkflow();
    tester.initializeGame();
    
    // 模擬玩家
    tester.game.players = [
      // 狼人
      { id: 1, name: '狼人1', isHuman: false, isAlive: true, role: '狼人' },
      { id: 2, name: '狼人2', isHuman: false, isAlive: true, role: '狼人' },
      // 好人
      { id: 3, name: '村民1', isHuman: true, isAlive: true, role: '村民' },
      { id: 4, name: '村民2', isHuman: false, isAlive: true, role: '村民' },
      { id: 5, name: '預言家', isHuman: false, isAlive: true, role: '預言家' },
    ];
    
    // 檢查遊戲結束條件 (當前情況下好人還未輸)
    let result = tester.game.isGameOver();
    console.log(`%c初始狀態遊戲結束檢查: ${result ? '遊戲結束' : '遊戲繼續'}`, 'color: #9966ff;');
    
    // 測試好人獲勝條件 (殺死所有狼人)
    tester.game.players[0].isAlive = false;
    tester.game.players[1].isAlive = false;
    
    result = tester.game.isGameOver();
    console.log(`%c殺死所有狼人後遊戲結束檢查: ${result ? '遊戲結束' : '遊戲繼續'}`, 'color: #9966ff;');
    console.log(`%c獲勝陣營: ${tester.game.state.winner}`, 'color: #00cc66; font-weight: bold;');
    
    // 重置遊戲狀態
    tester.game.players[0].isAlive = true;
    tester.game.players[1].isAlive = true;
    tester.game.state.winner = null;
    
    // 測試狼人獲勝條件 (狼人數量 >= 好人數量)
    tester.game.players[3].isAlive = false;
    tester.game.players[4].isAlive = false;
    
    result = tester.game.isGameOver();
    console.log(`%c狼人與好人數量相同時遊戲結束檢查: ${result ? '遊戲結束' : '遊戲繼續'}`, 'color: #9966ff;');
    console.log(`%c獲勝陣營: ${tester.game.state.winner}`, 'color: #00cc66; font-weight: bold;');
    
    console.log('%c遊戲結束條件測試完成！', 'color: #00cc66; font-weight: bold;');
    return result;
  },

  // 測試遊戲歷史紀錄功能
  testGameHistory: () => {
    console.log('%c測試遊戲歷史紀錄功能...', 'color: #0099ff; font-weight: bold;');
    const tester = new TestWorkflow();
    tester.initializeGame();
    
    // 添加一些測試紀錄
    tester.apiManager.addGameMessage('系統', '遊戲開始', '遊戲設置', 0);
    tester.apiManager.addGameMessage('系統', '進入第 1 天夜晚階段', '夜晚', 1);
    tester.apiManager.addGameMessage('系統', '守衛的回合開始', '夜晚', 1);
    tester.apiManager.addGameMessage('系統', '守衛的回合結束', '夜晚', 1);
    tester.apiManager.addGameMessage('系統', '狼人的回合開始', '夜晚', 1);
    tester.apiManager.addGameMessage('玩家-2', '選擇擊殺玩家-4', '夜晚', 1);
    tester.apiManager.addGameMessage('系統', '狼人的回合結束', '夜晚', 1);
    tester.apiManager.addGameMessage('系統', '進入第 1 天白天討論階段', '白天討論', 1);
    tester.apiManager.addGameMessage('系統', '玩家-4被狼人殺死了', '白天討論', 1);
    
    // 測試獲取歷史紀錄
    const allHistory = tester.apiManager.gameHistory.getAllRecords();
    console.log(`%c總共記錄了 ${allHistory.length} 條歷史訊息`, 'color: #9966ff;');
    
    // 測試獲取特定階段的紀錄
    const nightRecords = tester.apiManager.gameHistory.getRecordsByPhase('夜晚');
    console.log(`%c夜晚階段有 ${nightRecords.length} 條紀錄`, 'color: #9966ff;');
    
    // 測試格式化紀錄
    const formattedHistory = tester.apiManager.gameHistory.formatToText();
    console.log('%c格式化歷史紀錄:', 'color: #9966ff;');
    console.log(formattedHistory);
    
    console.log('%c遊戲歷史紀錄功能測試完成！', 'color: #00cc66; font-weight: bold;');
    return allHistory;
  },
  
  // 測試 AI 啟用功能
  testAIEnabled: () => {
    console.log('%c測試 AI 啟用功能...', 'color: #0099ff; font-weight: bold;');
    const tester = new TestWorkflow();
    tester.initializeGame();
    
    // 預設值檢查
    console.log('檢查 AI 功能預設值...');
    if (tester.game.settings.useAI === false) {
      console.log('%c✓ AI 功能預設為停用', 'color: #00cc66;');
    } else {
      console.error('❌ AI 功能預設值不正確');
    }
    
    // 測試啟用 AI
    console.log('測試啟用 AI 功能...');
    tester.game.setAIEnabled(true);
    if (tester.game.settings.useAI === true) {
      console.log('%c✓ AI 功能成功啟用', 'color: #00cc66;');
    } else {
      console.error('❌ AI 功能啟用失敗');
    }
    
    // 測試停用 AI
    console.log('測試停用 AI 功能...');
    tester.game.setAIEnabled(false);
    if (tester.game.settings.useAI === false) {
      console.log('%c✓ AI 功能成功停用', 'color: #00cc66;');
    } else {
      console.error('❌ AI 功能停用失敗');
    }
    
    // 測試帶有無效參數
    console.log('測試無效參數...');
    try {
      tester.game.setAIEnabled('不是布林值');
      console.error('❌ 應該拒絕非布林值的參數');
    } catch (e) {
      console.log('%c✓ 正確拒絕非布林值的參數', 'color: #00cc66;');
    }
    
    console.log('%c測試 AI 啟用功能完成！', 'color: #00cc66; font-weight: bold;');
    return true;
  }
};

// 匯出測試模組
export default { runWerewolfTest, TestWorkflow, werewolfTests };

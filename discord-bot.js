// discord.js を使用してボットを作成
const { Client, GatewayIntentBits, Partials, EmbedBuilder, Permissions, PermissionFlagsBits } = require('discord.js');
require('dotenv').config();

// クライアントを初期化（必要なIntentsを設定）
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel]
});

// ボットが準備できたらコンソールに表示
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// メッセージが送信されたときの処理
client.on('messageCreate', async (message) => {
  // ボット自身のメッセージには反応しない
  if (message.author.bot) return;
  
  // !textコマンドの処理
  if (message.content.startsWith('!text')) {
    // Ownerロールを持っているか確認
    const hasOwnerRole = message.member.roles.cache.some(role => role.name === 'Owner');
    
    // Ownerロールを持っていない場合は処理を中止
    if (!hasOwnerRole) {
      await message.reply('このコマンドはOwnerロールを持つユーザーのみ使用できます。');
      return;
    }
    
    // コマンドからテキスト部分を取得（!textの後の部分）
    const text = message.content.slice('!text'.length).trim();
    
    // テキストが空の場合はエラーメッセージを返す
    if (!text) {
      await message.reply('テキストを入力してください。例: `!text こんにちは、世界！`');
      return;
    }
    
    try {
      // 埋め込みメッセージを作成
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setDescription(text)
        .setTimestamp()
        .setFooter({ text: `送信者: ${message.author.tag}` });
      
      // 埋め込みメッセージを送信
      await message.channel.send({ embeds: [embed] });
      
      // 元のコマンドメッセージを削除（オプション）
      await message.delete().catch(console.error);
    } catch (error) {
      console.error('エラーが発生しました:', error);
      await message.reply('メッセージの送信中にエラーが発生しました。');
    }
  }
});

// ボットにログイン
client.login(process.env.TOKEN);

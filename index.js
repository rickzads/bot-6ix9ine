const { 
  Client, GatewayIntentBits, EmbedBuilder, 
  ButtonBuilder, ButtonStyle, ActionRowBuilder,
  ModalBuilder, TextInputBuilder, TextInputStyle 
} = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// IDs
const CANAL_SET = '1486355619446259742';
const CANAL_STAFF = '1248451293895458831';
const CARGO_ID = '1248451293119516777';

// LINKS (Imgur direto)
const LOGO = 'https://i.imgur.com/w1lH6bz.png';
const BANNER = 'https://i.imgur.com/mEOh1CS.jpeg';

client.once('ready', async () => {
  console.log('Bot 6ix9ine online!');

  const canal = client.channels.cache.get(CANAL_SET);

  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('📌 Sistema de pedir set - 6ix9ine 💙🔥')
    .setDescription(`Clique no botão abaixo para solicitar seu set.

📌 Observações:
• Será necessário ter o ID do jogo e outras informações.
• Caso preencha algo incorretamente, será necessário refazer sua whitelist.`)
    .setThumbnail(LOGO)
    .setImage(BANNER)
    .setFooter({ text: '6ix9ine © Todos os direitos reservados' });

  const botao = new ButtonBuilder()
    .setCustomId('pedir_set')
    .setLabel('Pedir Set')
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(botao);

  canal.send({ embeds: [embed], components: [row] });
});

// INTERAÇÕES
client.on('interactionCreate', async interaction => {

  // BOTÃO PEDIR SET
  if (interaction.isButton() && interaction.customId === 'pedir_set') {

    const modal = new ModalBuilder()
      .setCustomId('formulario_set')
      .setTitle('Formulário - 6ix9ine');

    const nome = new TextInputBuilder()
      .setCustomId('nome')
      .setLabel('Nome (Personagem)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const id = new TextInputBuilder()
      .setCustomId('id')
      .setLabel('ID (Jogo)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const telefone = new TextInputBuilder()
      .setCustomId('telefone')
      .setLabel('Telefone (Jogo)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const recrutador = new TextInputBuilder()
      .setCustomId('recrutador')
      .setLabel('Recrutador')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder().addComponents(nome),
      new ActionRowBuilder().addComponents(id),
      new ActionRowBuilder().addComponents(telefone),
      new ActionRowBuilder().addComponents(recrutador),
    );

    await interaction.showModal(modal);
  }

  // FORMULÁRIO ENVIADO
  if (interaction.isModalSubmit() && interaction.customId === 'formulario_set') {

    const nome = interaction.fields.getTextInputValue('nome');
    const id = interaction.fields.getTextInputValue('id');
    const telefone = interaction.fields.getTextInputValue('telefone');
    const recrutador = interaction.fields.getTextInputValue('recrutador');

    const canalStaff = interaction.guild.channels.cache.get(CANAL_STAFF);

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('📩 Novo pedido de SET - 6ix9ine')
      .addFields(
        { name: '👤 Usuário', value: `<@${interaction.user.id}>` },
        { name: '🧍 Nome', value: nome },
        { name: '🆔 ID', value: id },
        { name: '📞 Telefone', value: telefone },
        { name: '📌 Recrutador', value: recrutador }
      )
      .setFooter({ text: 'Sistema 6ix9ine' });

    const aprovar = new ButtonBuilder()
      .setCustomId(`aprovar_${interaction.user.id}`)
      .setLabel('Aprovar')
      .setStyle(ButtonStyle.Success);

    const reprovar = new ButtonBuilder()
      .setCustomId(`reprovar_${interaction.user.id}`)
      .setLabel('Reprovar')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(aprovar, reprovar);

    canalStaff.send({ embeds: [embed], components: [row] });

    await interaction.reply({
      content: '📩 Pedido enviado para análise!',
      ephemeral: true
    });
  }

  // APROVAR
  if (interaction.isButton() && interaction.customId.startsWith('aprovar_')) {

  const userId = interaction.customId.split('_')[1];
  const membro = await interaction.guild.members.fetch(userId);
  const cargo = interaction.guild.roles.cache.get(CARGO_ID);

  await interaction.deferUpdate();

  await membro.roles.add(cargo);

  // PEGAR INFORMAÇÕES DO EMBED
  const embed = interaction.message.embeds[0];

  const nome = embed.fields.find(f => f.name === '🧍 Nome').value;
  const id = embed.fields.find(f => f.name === '🆔 ID').value;

  // ALTERAR NICK
  await membro.setNickname(`MB | ${nome} | ${id}`);

  await interaction.editReply({
    content: `✅ Aprovado por ${interaction.user.tag}`,
    components: []
  });

  membro.send('✅ Você foi aprovado na 6ix9ine!');
}

  // REPROVAR
  if (interaction.isButton() && interaction.customId.startsWith('reprovar_')) {

    const userId = interaction.customId.split('_')[1];
    const membro = await interaction.guild.members.fetch(userId);

    await interaction.update({
      content: `❌ Reprovado por ${interaction.user.tag}`,
      components: []
    });

    membro.send('❌ Seu pedido foi reprovado. Tente novamente.');
  }
});

client.login(process.env.MTQ4NjM1MDI3MjQzNDQwOTQ3Mg.G_OOSx.GZoWIjVqi8JBXh59jRCKDKU7jxm4wKJ9KAd0hY);
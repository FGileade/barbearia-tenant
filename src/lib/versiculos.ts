export interface Versiculo {
  texto: string;
  ref: string;
}

// Almeida Revista e Corrigida. A lista tem 31 versículos para que dias
// consecutivos nunca repitam (ver `versiculoDoDia`).
export const VERSICULOS: Versiculo[] = [
  { texto: "O Senhor é o meu pastor; nada me faltará.", ref: "Salmos 23:1" },
  { texto: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.", ref: "Provérbios 3:5" },
  { texto: "Posso todas as coisas em Cristo que me fortalece.", ref: "Filipenses 4:13" },
  { texto: "Não to mandei eu? Esforça-te, e tem bom ânimo; não pasmes, nem te espantes, porque o Senhor teu Deus é contigo, por onde quer que andares.", ref: "Josué 1:9" },
  { texto: "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça.", ref: "Isaías 41:10" },
  { texto: "Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia.", ref: "Salmos 46:1" },
  { texto: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.", ref: "Jeremias 29:11" },
  { texto: "Mas buscai primeiro o reino de Deus, e a sua justiça, e todas estas coisas vos serão acrescentadas.", ref: "Mateus 6:33" },
  { texto: "E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.", ref: "Romanos 8:28" },
  { texto: "Entrega o teu caminho ao Senhor; confia nele, e ele o fará.", ref: "Salmos 37:5" },
  { texto: "Confia ao Senhor as tuas obras, e teus pensamentos serão estabelecidos.", ref: "Provérbios 16:3" },
  { texto: "Levantarei os meus olhos para os montes, de onde vem o meu socorro. O meu socorro vem do Senhor, que fez o céu e a terra.", ref: "Salmos 121:1-2" },
  { texto: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.", ref: "Mateus 11:28" },
  { texto: "Este é o dia que fez o Senhor; regozijemo-nos e alegremo-nos nele.", ref: "Salmos 118:24" },
  { texto: "Instrui o menino no caminho em que deve andar, e, ainda quando velho, não se desviará dele.", ref: "Provérbios 22:6" },
  { texto: "E tudo quanto fizerdes, fazei-o de todo o coração, como ao Senhor, e não aos homens.", ref: "Colossenses 3:23" },
  { texto: "Todas as vossas coisas sejam feitas com amor.", ref: "1 Coríntios 16:14" },
  { texto: "O Senhor é a minha luz e a minha salvação; a quem temerei? O Senhor é a força da minha vida; de quem me recearei?", ref: "Salmos 27:1" },
  { texto: "Mas os que esperam no Senhor renovarão as forças, subirão com asas como águias; correrão, e não se cansarão; caminharão, e não se fatigarão.", ref: "Isaías 40:31" },
  { texto: "Provai, e vede que o Senhor é bom; bem-aventurado o homem que nele confia.", ref: "Salmos 34:8" },
  { texto: "Torre forte é o nome do Senhor; o justo corre para ela, e está seguro.", ref: "Provérbios 18:10" },
  { texto: "Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará.", ref: "Salmos 91:1" },
  { texto: "E não nos cansemos de fazer bem, porque a seu tempo ceifaremos, se não houvermos desfalecido.", ref: "Gálatas 6:9" },
  { texto: "E, se algum de vós tem falta de sabedoria, peça-a a Deus, que a todos dá liberalmente, e o não lança em rosto, e ser-lhe-á dada.", ref: "Tiago 1:5" },
  { texto: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.", ref: "João 3:16" },
  { texto: "Lâmpada para os meus pés é a tua palavra, e luz para o meu caminho.", ref: "Salmos 119:105" },
  { texto: "Como o ferro com o ferro se afia, assim o homem afia o rosto do seu amigo.", ref: "Provérbios 27:17" },
  { texto: "Não estejais inquietos por coisa alguma; antes as vossas petições sejam em tudo conhecidas diante de Deus pela oração e súplica, com ação de graças.", ref: "Filipenses 4:6" },
  { texto: "Far-me-ás ver a vereda da vida; na tua presença há plenitude de alegria, à tua mão direita há delícias perpetuamente.", ref: "Salmos 16:11" },
  { texto: "Tudo tem o seu tempo determinado, e há tempo para todo o propósito debaixo do céu.", ref: "Eclesiastes 3:1" },
  { texto: "Assim resplandeça a vossa luz diante dos homens, para que vejam as vossas boas obras e glorifiquem a vosso Pai, que está nos céus.", ref: "Mateus 5:16" },
];

/** Um versículo por dia: avança 1 posição a cada dia (data local), então dias seguidos nunca repetem. */
export function versiculoDoDia(hoje: Date = new Date()): Versiculo {
  const diasDesdeEpoca = Math.floor(Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()) / 86_400_000);
  return VERSICULOS[diasDesdeEpoca % VERSICULOS.length];
}

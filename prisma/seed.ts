import { PrismaClient } from "@prisma/client";
import { ulid } from "ulid";

const prisma = new PrismaClient();

const partnerId = "01JXTGK92YQK6RQDDPH741RVDC";

const sellerNames = [
  "Alice Silva",
  "Bruno Costa",
  "Carla Oliveira",
  "Daniel Souza",
  "Eduarda Lima",
  "Felipe Rocha",
  "Gabriela Mendes",
  "Henrique Ribeiro",
  "Isabela Martins",
  "João Almeida",
  "Karen Fernandes",
  "Lucas Pereira",
  "Mariana Azevedo",
  "Nathan Torres",
  "Olívia Castro",
  "Pedro Santos",
  "Queila Dias",
  "Rafael Gomes",
  "Sabrina Monteiro",
  "Tiago Barros",
  "Ursula Nunes",
  "Vinicius Teixeira",
  "Wesley Moura",
  "Xuxa Amaral",
  "Yasmin Duarte",
  "Zeca Lins",
  "Alan Viana",
  "Bianca Freitas",
  "Caio Ramos",
  "Diana Prado",
  "Eduardo Matos",
  "Fernanda Luz",
  "Gustavo Melo",
  "Helena Barbosa",
  "Igor Farias",
  "Juliana Reis",
  "Kevin Braga",
  "Larissa Cunha",
  "Murilo Andrade",
  "Nathalia Paiva",
];

const productNames = [
  "Camiseta Estampada",
  "Calça Jeans",
  "Tênis Esportivo",
  "Bolsa Couro",
  "Relógio Digital",
  "Óculos de Sol",
  "Jaqueta Jeans",
  "Vestido Floral",
  "Camisa Social",
  "Sandália Plataforma",
  "Mochila Escolar",
  "Blusa de Lã",
  "Shorts Sarja",
  "Boné Casual",
  "Calça Legging",
  "Tênis Casual",
  "Saia Jeans",
  "Chinelo Slide",
  "Relógio Analógico",
  "Cinto de Couro",
  "Camisa Polo",
  "Bermuda Masculina",
  "Sapato Social",
  "Blazer Slim",
  "Meia Cano Alto",
  "Top Fitness",
  "Macacão Jeans",
  "Regata Dry",
  "Sapatênis",
  "Tênis Skate",
];

const eventNames = [
  "Outlet de Verão",
  "Feira Fashion",
  "Liquida Inverno",
  "Bazar Primavera",
  "Festival da Economia",
  "Semana do Consumidor",
  "Mega Promoção",
];

const leadSources = ["Instagram", "Facebook", "LinkedIn", "Feira", "WhatsApp"];

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePhotoUrl(index: number) {
  return `https://images.unsplash.com/photo-15${index
    .toString()
    .padStart(6, "0")}-1000x1000`;
}

async function main() {
  // 🧹 Limpa o banco
  await prisma.lead.deleteMany();
  await prisma.sellerEvent.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.event.deleteMany();
  await prisma.product.deleteMany();
  await prisma.seller.deleteMany();

  // 🛍️ Produtos
  await prisma.product.createMany({
    data: productNames.map((name, index) => ({
      id: ulid(),
      name,
      price: getRandomInt(20, 200),
      partnerId,
      photo: generatePhotoUrl(index + 100), // +100 para evitar colisão com sellers/events
    })),
  });
  const products = await prisma.product.findMany();

  // 👨‍💼 Sellers
  await prisma.seller.createMany({
    data: sellerNames.map((name, index) => ({
      id: ulid(),
      name,
      email: `vendedor${index + 1}@mail.com`,
      phone: `1199999-00${index + 1}`,
      partnerId,
      photo: generatePhotoUrl(index + 200), // sellers
    })),
  });
  const sellers = await prisma.seller.findMany();

  // 📅 Eventos
  const baseDate = new Date("2025-07-01");
  const eventIds: string[] = [];

  for (let i = 0; i < eventNames.length; i++) {
    const id = ulid();
    eventIds.push(id);
    const isActive = i < 3;

    const startDate = new Date(baseDate);
    startDate.setDate(baseDate.getDate() + i * 5);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 3);

    await prisma.event.create({
      data: {
        id,
        name: eventNames[i],
        startDate,
        endDate,
        isActive,
        partnerId,
        photo: generatePhotoUrl(i + 300), // eventos
      },
    });
  }

  // 🧲 Leads por evento
  for (const eventId of eventIds) {
    const leadCount = getRandomInt(10, 20);

    for (let i = 0; i < leadCount; i++) {
      const product = products[getRandomInt(0, products.length - 1)];
      const seller =
        Math.random() > 0.2
          ? sellers[getRandomInt(0, sellers.length - 1)]
          : null;

      await prisma.lead.create({
        data: {
          id: ulid(),
          name: `Lead ${Math.random().toString(36).substring(2, 7)}`,
          email:
            Math.random() > 0.3 ? `lead${ulid().slice(0, 6)}@mail.com` : null,
          phone:
            Math.random() > 0.3 ? `1198888-${getRandomInt(1000, 9999)}` : null,
          source: leadSources[getRandomInt(0, leadSources.length - 1)],
          customInterest: Math.random() > 0.8 ? product.name : null,
          notes: Math.random() > 0.5 ? "Interessado com urgência" : null,
          eventId,
          partnerId,
          sellerId: seller?.id ?? null,
          products: {
            connect: [{ id: product.id }],
          },
        },
      });
    }
  }

  console.log("✅ Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
main()
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

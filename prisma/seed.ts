import { PrismaClient } from "@prisma/client";
import { ulid } from "ulid";

const prisma = new PrismaClient();

const companyId = "01JYDXSRNA52QGB9T0ZEQA2ESX";

const sellerData = [
  {
    name: "Leslie Alexander",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Michael Foster",
    photo:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Dries Vincent",
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Lindsay Walton",
    photo:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Courtney Henry",
    photo:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Tom Cook",
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Beatriz Ramos",
    photo:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Carlos Medeiros",
    photo:
      "https://images.unsplash.com/photo-1603415526960-f8f0b0cae198?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Diana Lopes",
    photo:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Eduardo Nunes",
    photo:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Fernanda Torres",
    photo:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Guilherme Rocha",
    photo:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Helena Pires",
    photo:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Igor Fernandes",
    photo:
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Juliana Braga",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
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

const realLeadNames = [
  "Ana Paula",
  "Bruno Henrique",
  "Camila Souza",
  "Diego Martins",
  "Elisa Castro",
  "Fabio Silva",
  "Giovana Lima",
  "Henrique Barros",
  "Isabela Ribeiro",
  "João Pedro",
  "Karla Andrade",
  "Leonardo Rocha",
  "Mariana Dias",
  "Natalia Pires",
  "Otavio Ramos",
  "Patricia Nunes",
  "Rafael Cardoso",
  "Sofia Teixeira",
  "Thiago Almeida",
  "Vanessa Moura",
];

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePhotoUrl(index: number) {
  return `https://images.unsplash.com/photo-15${index
    .toString()
    .padStart(6, "0")}-1000x1000`;
}

async function main() {
  await prisma.lead.deleteMany();
  await prisma.sellerEvent.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.event.deleteMany();
  await prisma.product.deleteMany();
  await prisma.seller.deleteMany();

  await prisma.product.createMany({
    data: productNames.map((name, index) => ({
      id: ulid(),
      name,
      price: getRandomInt(20, 200),
      companyId,
      photo: generatePhotoUrl(index + 100),
    })),
  });
  const products = await prisma.product.findMany();

  await prisma.seller.createMany({
    data: sellerData.map((seller, index) => ({
      id: ulid(),
      name: seller.name,
      email: `vendedor${index + 1}@mail.com`,
      phone: `1199999-00${index + 1}`,
      companyId,
      photo: seller.photo,
    })),
  });
  const sellers = await prisma.seller.findMany();

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
        companyId,
        photo: generatePhotoUrl(i + 300),
      },
    });
  }

  for (const eventId of eventIds) {
    const leadCount = getRandomInt(10, 20);

    for (let i = 0; i < leadCount; i++) {
      const product = products[getRandomInt(0, products.length - 1)];
      const seller =
        Math.random() > 0.2
          ? sellers[getRandomInt(0, sellers.length - 1)]
          : null;
      const name = realLeadNames[getRandomInt(0, realLeadNames.length - 1)];

      await prisma.lead.create({
        data: {
          id: ulid(),
          name,
          email:
            Math.random() > 0.3 ? `lead${ulid().slice(0, 6)}@mail.com` : null,
          phone:
            Math.random() > 0.3 ? `1198888-${getRandomInt(1000, 9999)}` : null,
          source: leadSources[getRandomInt(0, leadSources.length - 1)],
          customInterest: Math.random() > 0.8 ? product.name : null,
          notes: Math.random() > 0.5 ? "Interessado com urgência" : null,
          eventId,
          companyId,
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

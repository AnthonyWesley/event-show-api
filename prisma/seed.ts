import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const partnerId = "01JXHJQGNYEA13244DVJ2QWRJE";

async function main() {
  // Create Events
  const events = await prisma.event.createMany({
    data: Array.from({ length: 5 }).map((_, i) => ({
      id: `e${i + 1}`,
      name: `Evento ${i + 1}`,
      startDate: new Date(`2025-06-${1 + i * 5}`),
      endDate: new Date(`2025-06-${5 + i * 5}`),
      partnerId,
    })),
  });

  // Create Sellers
  const sellers = await prisma.seller.createMany({
    data: Array.from({ length: 15 }).map((_, i) => ({
      id: `s${i + 1}`,
      name: `Seller ${i + 1}`,
      email: `seller${i + 1}@test.com`,
      phone: `9999-000${i + 1}`,
      partnerId,
    })),
  });

  // Create Products
  const products = await prisma.product.createMany({
    data: Array.from({ length: 10 }).map((_, i) => ({
      id: `p${i + 1}`,
      name: `Produto ${String.fromCharCode(65 + i)}`,
      price: 10 + i * 5,
      partnerId,
    })),
  });

  // Create Leads
  for (let i = 0; i < 20; i++) {
    await prisma.lead.create({
      data: {
        id: `l${i + 1}`,
        name: `Lead ${i + 1}`,
        email: i % 3 === 0 ? null : `lead${i + 1}@test.com`,
        phone: i % 4 === 0 ? null : `1111-00${i + 1}`,
        source: ["Instagram", "Facebook", "LinkedIn", "Feira"][i % 4],
        customInterest: i % 5 === 0 ? "Produto A" : null,
        notes: i % 2 === 0 ? "Interessado" : null,
        eventId: `e${(i % 5) + 1}`,
        partnerId,
        sellerId: i % 3 === 0 ? null : `s${(i % 15) + 1}`,
        products: {
          connect: i % 2 === 0 ? [{ id: `p${(i % 10) + 1}` }] : [],
        },
      },
    });
  }

  console.log("✅ Seed completo!");
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });

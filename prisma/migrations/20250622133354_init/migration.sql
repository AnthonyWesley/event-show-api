-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('CREATE_SALE', 'UPDATE_SALE', 'DELETE_SALE');

-- CreateEnum
CREATE TYPE "ActionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'BASIC', 'PREMIUM');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "GoalType" AS ENUM ('QUANTITY', 'VALUE');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "photo" TEXT,
    "photoPublicId" TEXT,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "refreshToken" TEXT,
    "accessExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "photo" TEXT,
    "photoPublicId" TEXT,
    "partnerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "photo" TEXT,
    "photoPublicId" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "partnerId" TEXT NOT NULL,
    "goal" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "goalType" "GoalType" NOT NULL DEFAULT 'QUANTITY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "customInterest" TEXT,
    "notes" TEXT,
    "source" TEXT NOT NULL,
    "sellerId" TEXT,
    "eventId" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seller" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "photo" TEXT,
    "photoPublicId" TEXT,
    "partnerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Seller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellerEvent" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "SellerEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingAction" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "actionType" "ActionType" NOT NULL,
    "targetId" TEXT,
    "sellerId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "ActionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PendingAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LeadProducts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LeadProducts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_email_key" ON "Partner"("email");

-- CreateIndex
CREATE INDEX "Partner_plan_idx" ON "Partner"("plan");

-- CreateIndex
CREATE INDEX "Product_partnerId_idx" ON "Product"("partnerId");

-- CreateIndex
CREATE INDEX "Event_partnerId_idx" ON "Event"("partnerId");

-- CreateIndex
CREATE INDEX "Event_isActive_idx" ON "Event"("isActive");

-- CreateIndex
CREATE INDEX "Event_partnerId_isActive_idx" ON "Event"("partnerId", "isActive");

-- CreateIndex
CREATE INDEX "Lead_eventId_idx" ON "Lead"("eventId");

-- CreateIndex
CREATE INDEX "Lead_partnerId_idx" ON "Lead"("partnerId");

-- CreateIndex
CREATE INDEX "Lead_sellerId_idx" ON "Lead"("sellerId");

-- CreateIndex
CREATE INDEX "Seller_partnerId_idx" ON "Seller"("partnerId");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_partnerId_email_key" ON "Seller"("partnerId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "SellerEvent_sellerId_eventId_key" ON "SellerEvent"("sellerId", "eventId");

-- CreateIndex
CREATE INDEX "_LeadProducts_B_index" ON "_LeadProducts"("B");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seller" ADD CONSTRAINT "Seller_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerEvent" ADD CONSTRAINT "SellerEvent_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerEvent" ADD CONSTRAINT "SellerEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingAction" ADD CONSTRAINT "PendingAction_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LeadProducts" ADD CONSTRAINT "_LeadProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LeadProducts" ADD CONSTRAINT "_LeadProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

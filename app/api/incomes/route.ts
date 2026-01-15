import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server";

export async function GET(){
    try{
        const incomes = await prisma.incomes.findMany({
            include: {
                peoples:true,
                categories:true,
                sub_categories:true,
                projects:true
            },
            orderBy:{
                IncomeDate:'desc'
            }
        });
        return NextResponse.json(incomes);
    } catch (error) {
        return NextResponse.json(
            {message: 'Failed to fatch incomes',error},
            {status: 500}
        );
    }
}
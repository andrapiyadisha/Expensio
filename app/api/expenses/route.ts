import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(){
    try{
       const expenses = await prisma.expenses.findMany({
        include:{
            peoples:true,
            categories:true,
            sub_categories:true,
            projects:true
        },
        orderBy:{
            ExpenseDate:'desc'
        }
       });
       return NextResponse.json(expenses);
    } catch (error){
        return NextResponse.json(
            {message: 'Failed to fetch expenses', error},
            {status: 500}
        )
    }
}

export async function POST(req: Request){

}
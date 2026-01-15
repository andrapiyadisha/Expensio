import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server";

export async function GET(){
    try{
        const peoples = await prisma.peoples.findMany({
            where:{ IsActive: true },
            orderBy:{PeopleName: 'asc'}
        });

        return NextResponse.json(peoples);
    }catch (error){
        return NextResponse.json(
            {message:'Failed to fetch peoples', error},
            {status:500}
        )
    }
}
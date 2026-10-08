
import { getSesion, getShiftbyUser } from "@/app/actions";
import { NextResponse } from "next/server";

export async function POST() {
    const session = await getSesion();
    const userId = session.userId as string;

    const shift = await getShiftbyUser(userId);

    if (!shift) {
        return NextResponse.json({
            redirect: null
        });
    }

    const startTime = new Date(shift.startTime);
    const currentTime = new Date();
    const diffInMs = currentTime.getTime() - startTime.getTime();
    const limitHrs = 15 * 60 * 60 * 1000;

    session.shiftOpen = true;
    session.activeshift = shift.id;

    await session.save();

    if (diffInMs >= limitHrs) {
        return NextResponse.json({
            redirect: "/turno/warning"
        });
    }

    return NextResponse.json({
        redirect: "/ordenes"
    });
}
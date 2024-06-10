'use client'
import Link from "next/link";
import { selectUser, selectIsVisitor, selectIsAgency } from "@/store/features/auth/authSlice";
import { useAppSelector } from "@/store/hooks";

export function SideBar({isAdmin, isActive, handleMenuClick}:
    {
        isAdmin:boolean, 
        isActive:boolean,
        handleMenuClick:() => void,
    })
{
    const user = useAppSelector(selectUser);
    const isVisitor = useAppSelector(selectIsVisitor);
    const isAgency = useAppSelector(selectIsAgency);
    const className1 = isActive ? "w-[300px] z-50":"w-0";
    const className2 = isActive ? "ml-0 w-[300px]":"ml-[-300px]";
    const className3 = isActive ? "left-0 ":"left-[-100vw] bg-opacity-0";
    return(
        <div onClick={handleMenuClick} className={className1+" bg-white min-h-[calc(100vh-82px)] sm:min-h-[calc(100vh-175px)] border-r-2 fixed border-blue-300 transition-all sm:relative sm:block sm:w-[21%] sm:min-w-[202px] sm:max-w-[302px] "}>
            {/* <div className="fix w-[100vw] h-full bg-black bg-opacity-10"></div> */}
            <div className={className2 + " fixed z-10 bg-white min-h-[calc(100vh-82px)] sm:min-h-[calc(100vh-175px)] sm:w-[20%]  sm:min-w-[200px] sm:max-w-[300px] sm:ml-0 transition-all"}>
                <Link href="/dashboard" className="block text-2xl text-center p-2">
                    <span className="text-3xl capitalize">{user.title}</span>'s Page
                </Link>
                {isAdmin && !isVisitor?
                    <Link href="/dashboard/users" className="block text-lg p-2 hover:bg-slate-100">
                        Users
                    </Link>
                :
                <></>
                }
                {isVisitor?
                <></>
                :
                    <Link href="/dashboard/password" className="block text-lg p-2 hover:bg-slate-100">
                        Password
                    </Link>
                }
                <Link href="/dashboard/items" className={isVisitor?"hidden":" block text-lg p-2 hover:bg-slate-100"}>
                    Manage Items
                </Link>
                <Link href="/dashboard/flower" className="block text-lg ml-5 p-2 hover:bg-slate-100">
                    Flower
                </Link>
                <Link href="/dashboard/edibles" className="block text-lg ml-5 p-2 hover:bg-slate-100">
                    Edibles
                </Link>
                <Link href="/dashboard/extracts" className="block text-lg ml-5 p-2 hover:bg-slate-100">
                    Extracts
                </Link>
                <Link href="/dashboard/pre-rolls" className="block text-lg ml-5 p-2 hover:bg-slate-100">
                    Pre-rolls
                </Link>

                {isVisitor?
                <></>
                :
                    <Link href="/dashboard/normalCoupon" className="block text-lg p-2 hover:bg-slate-100">
                        Normal Coupons
                    </Link>
                }
                {(isAdmin || isAgency) && 
                    <>
                        <Link href="/dashboard/specialCoupon" className="block text-lg p-2 hover:bg-slate-100">
                            Special Coupons
                        </Link>
                        <Link href="/dashboard/manageViewer" className="block text-lg p-2 hover:bg-slate-100">
                            Manage Viewer
                        </Link>
                    </>
                }
            </div>
            <div className={className3 + " absolute transition-opacity top-0 w-[100vw] h-full bg-black z-0 bg-opacity-30 sm:hidden block"}>

            </div>
        </div>
    )
}
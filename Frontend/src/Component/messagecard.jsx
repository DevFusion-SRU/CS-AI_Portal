import React from "react";
import { Messages, SearchNormal,Clock } from "iconsax-react";

const messagecard=()=>{return(<div className="px-4 py-4 w-full mt-2 space-y-3 bg-[#FFF] shadow-md rounded-lg">
            <div className="flex items-center w-full">
                <div className="flex items-center space-x-2">
                    <Messages size={60} color="#0A3D91" />
                    <div className="space-y-2">
                        <div className="font-pt text-lg text-[#222222]">username</div>
                        <div className="font-pt text-sm text-[#3A3A3A]">role</div>
                    </div>
                </div>
                <div className="ml-auto text-sm text-right text-gray-500">
                    date
                </div>
                <Clock size={20} color="#0A3D91" className="mx-2" />
            </div>
            <div className="font-pt">description</div>
        </div>
        );};
export default messagecard;
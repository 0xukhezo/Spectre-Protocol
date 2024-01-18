// React
import React, { ReactElement } from "react";
// Next
import Image from "next/image";

type NotificationsCardProps = {
  image: string | ReactElement;
  title: string;
  txDescription: string;
  className?: string;
};

export default function NotificationsCard({
  image,
  title,
  txDescription,
  className,
}: NotificationsCardProps) {
  return (
    <div className={className ? className : "absolute top-24 right-24 z-10"}>
      <div className="relative transform overflow-hidden rounded-3xl bg-gray-100 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:m-8 max-w-[300px] sm:p-6 shadow-input">
        <div className="items-end w-full flex flex-row text-center max-w-[300px]">
          {typeof image !== "string" ? (
            <div className="max-w-[100px] max-h-[100px] -mt-[20px]">
              {image}
            </div>
          ) : (
            <Image
              height={60}
              width={60}
              alt="User Image"
              src={image}
              className="mr-4"
            />
          )}

          <div className="mt-3 sm:mt-0 sm:text-left w-[150px] mr-[70px] text-black">
            <h3 className="font-medium leading-6 text-lg">{title}</h3>
            <p className="text-xs font-medium">{txDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

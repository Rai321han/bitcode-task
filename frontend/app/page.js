"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <nav className=" bg-light-fg dark:bg-dark-fg sticky top-0 z-1000">
        <div className="flex flex-row justify-between items-stretch">
          <div className="flex flex-row gap-3 items-center">
            <div className="py-1 sm:py-2 px-4 font-extrabold text-primary bg-light-bg dark:bg-dark-bg">
              bitcode.
            </div>
          </div>
          <div className="flex flex-row items-stretch text-xs sm:text-sm">
            <div className="px-4 my-auto">
              <Link
                href={"/auth/login"}
                className="hover:underline hover:underline-offset-4 hover:text-primary cursor-pointer "
              >
                Sign in
              </Link>
            </div>
            <Link
              href={"/auth/register"}
              className="cursor-pointer flex flex-col justify-center hover:brightness-105 disabled:cursor-not-allowed px-3 sm:px-4 bg-primary text-white text-md"
            >
              <p>Sign up</p>
            </Link>
          </div>
        </div>
      </nav>
      <div className="overflow-hidden items-center justify-items-center min-h-screen  gap-16  font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col  row-start-2 items-center sm:items-start w-full">
          <section className="min-h-[80vh] relative w-full flex flex-col gap-10 justify-center items-center bg-light-fg dark:bg-dark-fg">
            <div className="max-w-[900px] text-center">
              <p className="text-light-title dark:text-dark-title leading-tight text-3xl md:text-6xl font-extrabold  font-Inter">
                DRIVE PRODUCT <br /> DIRECTION TOGETHER
              </p>
            </div>

            <div>
              <p className=" text-center text-xl sm:text-2xl text-light-title dark:text-dark-title">
                Collaborate to shape <br />
                what comes next.
              </p>
            </div>
            <div className="absolute -left-[10%] top-[10%] blur-[150px] md:blur-[200px] w-[200px] h-[200px] md:w-[50%] md:h-[600px] rounded-[100%] bg-[#E6FFFA] "></div>
            <div className="absolute  -right-[10%] top-[10%] blur-[150px] md:blur-[200px] w-[200px] h-[200px] md:w-[50%] md:h-[600px] rounded-[100%] bg-[#FFE4CD]"></div>
          </section>
          <section className="relative w-full flex flex-col gap-20 ">
            <div
              className=" w-full pb-10 border-t-1 border-t-light-line dark:border-dark-line  bg-gradient-to-b from-light-bg dark:from-dark-bg from-50% to-transparent to-90%
"
            >
              <div className="max-w-[1000px] px-5 mx-auto flex flex-col-reverse tablet:flex tablet:flex-row gap-2">
                <div className="p-10">
                  <p className="text-light-body dark:text-dark-body  leading-tight text-md  sm:text-2xl max-w-[500px]">
                    Explore powerful roadmaps crafted to guide your development
                    journey with clarity, focus, and purpose.
                  </p>
                </div>
                <div className="-mt-10 transition-all duration-150 ease-out">
                  <Image
                    src="/assets/roadmaps.svg"
                    className="block dark:hidden"
                    width={700}
                    height={700}
                    alt="feature-image-1"
                  />
                  <Image
                    src="/assets/roadmaps-dark.svg"
                    className="hidden dark:block"
                    width={700}
                    height={700}
                    alt="feature-image-1"
                  />
                </div>
              </div>
            </div>

            <div className=" w-full pb-10 border-t-1 border-t-light-line dark:border-dark-line  bg-gradient-to-b from-light-bg dark:from-dark-bg from-50% to-transparent to-90%">
              <div className="max-w-[1000px] px-5 mx-auto flex flex-col-reverse tablet:flex tablet:flex-row gap-2">
                <div className="p-10">
                  <p className="text-light-body dark:text-dark-body  leading-tight text-md  sm:text-2xl max-w-[500px]">
                    Turn your vision into action, break it into milestones, and
                    achieve greatness step by step.
                  </p>
                </div>
                <div className="-mt-10 transition-all duration-150 ease-out">
                  <Image
                    src="/assets/milestone-dark.svg"
                    className="hidden dark:block"
                    width={700}
                    height={700}
                    alt="feature-image-1"
                  />
                  <Image
                    src="/assets/milestone.svg"
                    className="block dark:hidden"
                    width={700}
                    height={700}
                    alt="feature-image-1"
                  />
                </div>
              </div>
            </div>

            <div className=" w-full pb-10 border-t-1 border-t-light-line dark:border-dark-line  bg-gradient-to-b from-light-bg dark:from-dark-bg from-50% to-transparent to-90%">
              <div className="max-w-[1000px] px-5 mx-auto flex flex-col-reverse tablet:flex tablet:flex-row gap-2">
                <div className="p-10">
                  <p className="text-light-body dark:text-dark-body  leading-tight text-md  sm:text-2xl max-w-[500px]">
                    Share thoughts, ask questions, or start a discussion.
                  </p>
                </div>
                <div className="-mt-10 transition-all duration-150 ease-out">
                  <Image
                    src="/assets/comment-dark.svg"
                    className="hidden dark:block"
                    width={700}
                    height={700}
                    alt="feature-image-1"
                  />
                  <Image
                    className="block dark:hidden"
                    src="/assets/comment.svg"
                    width={700}
                    height={700}
                    alt="feature-image-1"
                  />
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

"use client";

import { GitHub, Language } from "@mui/icons-material";
import Image from "next/image";
import Contributor from "@/components/ui/contributor";
import { Button } from "@/components/ui/shadcn/button";
import { trpc } from "@/utils/trpc";

export default function About() {
  const {
    data: queryResponse,
    isLoading,
    isError,
    error,
  } = trpc.peterplate_contributors.useQuery();

  return (
    <div className="flex flex-col">
      <Image
        className="object-cover w-full min-h-80 max-h-80"
        src="/uci.webp"
        alt="An Image of UCI's signage."
        width={2000}
        height={2000}
      />
      <div
        className="flex flex-col md:flex-row p-8 gap-6 max-w-100"
        id="about-content"
      >
        <div className="flex flex-col" id="about-text">
          <div className="flex gap-4 items-center mb-2" id="about-header">
            <h1 className="text-3xl font-bold" id="about-title">
              About <span className="text-sky-700">PeterPlate</span>
            </h1>
          </div>
          <div id="about-paragraph" className="grid gap-4 max-w-100">
            <p>
              PeterPlate is your go-to app for everything dining at UCI! From
              up-to-date menus and nutritional information to dining hall events
              and meal ratings, we make it easy to plan your next meal. Built by
              students, for students, our goal is to make campus dining more
              accessible and user-friendly.
            </p>
            <p>
              This project is proudly developed and maintained by&nbsp;
              <a
                className="underline text-sky-600"
                href="https://studentcouncil.ics.uci.edu/"
                rel="noreferrer"
                target="_blank"
              >
                ICS Student Council
              </a>
              , UCI's premier computer science club. As one of ICSSC's smaller
              teams, we're a tight-knit group passionate about improving student
              life through technology.
            </p>
            <div className="flex flex-col gap-4" id="contributors">
              <h1 className="text-xl max-md:text-base max-sm:text-sm font-bold">
                Our Lovely Contributors
              </h1>
              <div className="flex flex-wrap gap-2" id="contributor-grid">
                {isLoading && (
                  <p className="text-sm text-zinc-400">
                    Loading contributors...
                  </p>
                )}
                {!isLoading && isError && (
                  <p className="text-sm text-red-500 text-center">
                    Error occurred while fetching contributors: {error?.message}
                  </p>
                )}
                {!isLoading &&
                  !isError &&
                  queryResponse &&
                  queryResponse.map((contributor) => (
                    <Contributor
                      key={`${contributor.login}`}
                      name={contributor.name || contributor.login}
                      username={contributor.login}
                      profileSrc={contributor.avatar_url}
                      bio={contributor.bio || "PeterPlate Contributor"}
                      contributions={contributor.contributions}
                    />
                  ))}
              </div>
            </div>
            <p>
              Want to contribute? PeterPlate is open-source, and we welcome
              contributions on our&nbsp;
              <a
                className="underline text-sky-600"
                href="https://github.com/icssc/PeterPlate"
                rel="noreferrer"
                target="_blank"
              >
                GitHub
              </a>
              ! Have questions or ideas? Join the conversation on our&nbsp;
              <a
                className="underline text-sky-600"
                href="https://discord.gg/GzF76D7UhY"
                rel="noreferrer"
                target="_blank"
              >
                Discord
              </a>
              !
            </p>
            <div className="flex align-items gap-4">
              <Button
                className="bg-sky-700"
                onClick={() =>
                  window.open(
                    "https://github.com/icssc/PeterPlate/",
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
              >
                <GitHub /> GitHub
              </Button>
              <Button
                className="bg-sky-700"
                onClick={() =>
                  window.open(
                    "https://studentcouncil.ics.uci.edu/",
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
              >
                <Language /> Visit ICSSC
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

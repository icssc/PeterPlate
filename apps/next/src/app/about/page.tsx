"use client";

import { GitHub, Language, Typography } from "@mui/icons-material";
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
        className="flex flex-col md:flex-row p-8 gap-6 max-w-100 dark:text-zinc-200"
        id="about-content"
      >
        <div className="flex flex-col" id="about-text">
          <div className="flex gap-4 items-center mb-2" id="about-header">
            <Typography
              fontWeight={700}
              color="primary"
              id="about-title"
              sx={{ fontSize: "1.875rem" }}
            >
              About PeterPlate
            </Typography>
            <Image
              src="/peterplate-icon.webp"
              alt="PeterPlate's logo"
              width={32}
              height={32}
              className="rounded-full"
            />
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
                className="underline text-sky-600 dark:text-sky-400"
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
              <h1 className="text-xl max-md:text-base max-sm:text-sm font-bold dark:text-white">
                Our Lovely Contributors
              </h1>
              <div className="flex flex-wrap gap-2" id="contributor-grid">
                {isLoading && (
                  <p className="text-sm text-zinc-400 dark:text-zinc-500">
                    Loading contributors...
                  </p>
                )}
                {!isLoading && isError && (
                  <p className="text-sm text-red-500 dark:text-red-400 text-center">
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
                className="underline text-sky-600 dark:text-sky-400"
                href="https://github.com/icssc/PeterPlate"
                rel="noreferrer"
                target="_blank"
              >
                GitHub
              </a>
              ! Have questions or ideas? Join the conversation on our&nbsp;
              <a
                className="underline text-sky-600 dark:text-sky-400"
                href="https://discord.gg/GzF76D7UhY"
                rel="noreferrer"
                target="_blank"
              >
                Discord
              </a>
              !
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-fit bg-sky-700 text-white hover:bg-sky-800 dark:bg-blue-300 dark:text-gray-900 dark:hover:bg-blue-400">
                  Privacy Policy
                </Button>
              </DialogTrigger>
              <DialogContent className="w-md h-auto">
                <DialogHeader>
                  <DialogTitle className="p-4 text-center text-sky-700 dark:text-blue-300">
                    Privacy Policy
                  </DialogTitle>
                  <DialogDescription asChild className="p-4 dark:text-white">
                    <div>
                      <p className="mb-4">
                        PeterPlate is a cross-platform mobile application
                        designed to help users view dining hall menus at the
                        University of California, Irvine (UCI). We value your
                        privacy and are committed to protecting any personal
                        information you may share with us.
                      </p>
                      <p className="mb-4">
                        PeterPlate does not collect or store any personally
                        identifiable information. The app does not require login
                        or account creation. We do not track or monitor user
                        behavior within the app.
                      </p>
                      <p className="mb-4">
                        PeterPlate fetches dining hall menu data from publicly
                        available or authorized UCI resources. This data is used
                        solely to display daily menus within the app and is not
                        shared or stored beyond your device.
                      </p>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4" id="contributors">
          <Typography
            fontWeight={700}
            color="primary"
            className="text-xl max-md:text-base max-sm:text-sm"
          >
            Our Lovely Contributors
          </Typography>
          <div
            className="flex flex-wrap justify-center gap-2 max-w-xs"
            id="contributor-grid"
          >
            {isLoading && (
              <p className="text-sm text-zinc-400">Loading contributors...</p>
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
          <Typography
            variant="body2"
            color="text.secondary"
            className="italic font-light"
          >
            .. you could be here!
          </Typography>
        </div>
      </div>
    </div>
  );
}

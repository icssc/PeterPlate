"use client";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Button, IconButton, Menu, MenuItem, Toolbar } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GoogleSignInButton } from "@/components/auth/google-sign-in";
import { useSession } from "@/utils/auth-client";
import SidebarContent from "./sidebar/sidebar-content";

export default function Header(): JSX.Element {
    const { data: session, isPending } = useSession();
    const user = session?.user;
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [diningHallsAnchor, setDiningHallsAnchor] = useState<null | HTMLElement>(null);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleDiningHallsClick = (event: React.MouseEvent<HTMLElement>) => {
        setDiningHallsAnchor(event.currentTarget);
    };

    const handleDiningHallsClose = () => {
        setDiningHallsAnchor(null);
    };

    return (
        <>
            <AppBar
                position="absolute"
                className="!bg-[rgba(250,250,250,0.45)] backdrop-blur-[12px] shadow-none border-b border-[rgba(0,0,0,0.08)]"
            >
                <Toolbar className="justify-between px-4 py-2">
                    <div className="flex-none flex items-center">
                        <Link href="/" className="flex items-center">
                            <Image
                                className="rounded-full cursor-pointer"
                                src="/Zotmeal-Logo.webp"
                                alt="Zotmeal's Logo: a beige anteater with a bushy tail sitting next to an anthill."
                                width={40}
                                height={40}
                            />
                        </Link>
                    </div>

                    <nav className="flex-1 flex gap-0 justify-evenly">
                        <Button
                            onClick={handleDiningHallsClick}
                            endIcon={<ArrowDropDownIcon fontSize="small" />}
                            className="!text-[#1f2937] !normal-case !text-sm !font-medium hover:!bg-[rgba(0,0,0,0.04)]"
                        >
                            Dining Halls
                        </Button>
                        <Menu
                            anchorEl={diningHallsAnchor}
                            open={Boolean(diningHallsAnchor)}
                            onClose={handleDiningHallsClose}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                        >
                            <MenuItem
                                component={Link}
                                href="/?hall=brandywine"
                                onClick={handleDiningHallsClose}
                            >
                                Brandywine
                            </MenuItem>
                            <MenuItem
                                component={Link}
                                href="/?hall=anteatery"
                                onClick={handleDiningHallsClose}
                            >
                                Anteatery
                            </MenuItem>
                        </Menu>
                        <Button
                            component={Link}
                            href="/events"
                            className="!text-[#1f2937] !normal-case !text-sm !font-medium hover:!bg-[rgba(0,0,0,0.04)]"
                        >
                            Events
                        </Button>
                        <Button
                            component={Link}
                            href="/my-favorites"
                            className="!text-[#1f2937] !normal-case !text-sm !font-medium hover:!bg-[rgba(0,0,0,0.04)]"
                        >
                            Favorites
                        </Button>
                        <Button
                            component={Link}
                            href="/ratings"
                            className="!text-[#1f2937] !normal-case !text-sm !font-medium hover:!bg-[rgba(0,0,0,0.04)]"
                        >
                            Ratings
                        </Button>
                        <Button
                            component={Link}
                            href="/nutrition"
                            className="!text-[#1f2937] !normal-case !text-sm !font-medium hover:!bg-[rgba(0,0,0,0.04)]"
                        >
                            Tracker
                        </Button>
                    </nav>

                    <div className="flex-none flex items-center gap-4">
                        {isPending ? (
                            <>
                                <div className="w-24 h-5" />
                                <IconButton
                                    className="!text-[#1f2937] hover:!bg-[rgba(0,0,0,0.04)]"
                                    aria-label="Open sidebar"
                                    disabled
                                >
                                    <MenuIcon />
                                </IconButton>
                            </>
                        ) : user ? (
                            <>
                                <span className="text-sm text-gray-800 font-medium">
                                    {user.name || user.email || "User"}
                                </span>
                                <IconButton
                                    onClick={toggleDrawer}
                                    className="!text-[#1f2937] hover:!bg-[rgba(0,0,0,0.04)]"
                                    aria-label="Open sidebar"
                                >
                                    <MenuIcon />
                                </IconButton>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <GoogleSignInButton />
                                <IconButton
                                    onClick={toggleDrawer}
                                    className="!text-[#1f2937] hover:!bg-[rgba(0,0,0,0.04)]"
                                    aria-label="Open sidebar"
                                >
                                    <MenuIcon />
                                </IconButton>
                            </div>
                        )}
                    </div>
                </Toolbar>
            </AppBar>

            <SidebarContent open={drawerOpen} onClose={toggleDrawer} />
        </>
    );
}

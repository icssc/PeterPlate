"use client";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Button, Drawer, IconButton, Menu, MenuItem, Toolbar } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GoogleSignInButton } from "@/components/auth/google-sign-in";
import { useSession } from "@/utils/auth-client";
import SidebarContent from "./sidebar/sidebar-content";

/**
 * Renders the main header for the application.
 *
 * The header includes:
 * - A clickable application logo that navigates to the homepage ("/")
 * - Navigation links: Dining Halls, Events, Favorites, Ratings, Tracker
 * - User authentication display:
 *   - When logged in: Shows username and sidebar toggle button
 *   - When logged out: Shows sign-in button
 * - A sidebar drawer that opens when the menu button is clicked
 *
 * @returns {JSX.Element} The rendered header component.
 */
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
                sx={{
                    bgcolor: "rgba(250, 250, 250, 0.45)",
                    backdropFilter: "blur(12px)",
                    boxShadow: "none",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                }}
            >
                <Toolbar sx={{ justifyContent: "space-between", px: 2, py: 1 }}>
                    {/* Left: Logo */}
                    <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center" }}>
                        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
                            <Image
                                className="rounded-full cursor-pointer"
                                src="/Zotmeal-Logo.webp"
                                alt="Zotmeal's Logo: a beige anteater with a bushy tail sitting next to an anthill."
                                width={40}
                                height={40}
                            />
                        </Link>
                    </div>

                    {/* Center: Navigation Links */}
                    <nav style={{ flex: "1 1 auto", display: "flex", gap: "0", justifyContent: "space-evenly" }}>
                        <Button
                            onClick={handleDiningHallsClick}
                            endIcon={<ArrowDropDownIcon fontSize="small" />}
                            sx={{
                                color: "#1f2937",
                                textTransform: "none",
                                fontSize: "14px",
                                fontWeight: 500,
                                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                            }}
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
                            sx={{
                                color: "#1f2937",
                                textTransform: "none",
                                fontSize: "14px",
                                fontWeight: 500,
                                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                            }}
                        >
                            Events
                        </Button>
                        <Button
                            component={Link}
                            href="/my-favorites"
                            sx={{
                                color: "#1f2937",
                                textTransform: "none",
                                fontSize: "14px",
                                fontWeight: 500,
                                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                            }}
                        >
                            Favorites
                        </Button>
                        <Button
                            component={Link}
                            href="/ratings"
                            sx={{
                                color: "#1f2937",
                                textTransform: "none",
                                fontSize: "14px",
                                fontWeight: 500,
                                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                            }}
                        >
                            Ratings
                        </Button>
                        <Button
                            component={Link}
                            href="/meal-tracker"
                            sx={{
                                color: "#1f2937",
                                textTransform: "none",
                                fontSize: "14px",
                                fontWeight: 500,
                                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                            }}
                        >
                            Tracker
                        </Button>
                    </nav>

                    {/* Right: User info or Sign in */}
                    <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: "16px" }}>
                        {isPending ? (
                            // Render placeholder during loading to match client hydration
                            <>
                                <div style={{ width: "100px", height: "20px" }} />
                                <IconButton
                                    sx={{
                                        color: "#1f2937",
                                        "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                                    }}
                                    aria-label="Open sidebar"
                                    disabled
                                >
                                    <MenuIcon />
                                </IconButton>
                            </>
                        ) : user ? (
                            <>
                                <span style={{ fontSize: "14px", color: "#1f2937", fontWeight: 500 }}>
                                    {user.name || user.email || "User"}
                                </span>
                                <IconButton
                                    onClick={toggleDrawer}
                                    sx={{
                                        color: "#1f2937",
                                        "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                                    }}
                                    aria-label="Open sidebar"
                                >
                                    <MenuIcon />
                                </IconButton>
                            </>
                        ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <GoogleSignInButton />
                                <IconButton
                                    onClick={toggleDrawer}
                                    sx={{
                                        color: "#1f2937",
                                        "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                                    }}
                                    aria-label="Open sidebar"
                                >
                                    <MenuIcon />
                                </IconButton>
                            </div>
                        )}
                    </div>
                </Toolbar>
            </AppBar>

            {/* MUI Drawer for Sidebar */}
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
                <SidebarContent />
            </Drawer>
        </>
    );
}

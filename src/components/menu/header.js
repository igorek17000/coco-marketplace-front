import React, { useEffect, useState } from "react";
import Breakpoint, {
    BreakpointProvider,
    setDefaultBreakpoints,
} from "react-socks";
import { useNavigate } from "@reach/router";
import { Link } from "@reach/router";
import useOnclickOutside from "react-cool-onclickoutside";
import { useWallet } from "use-wallet";
import { useBlockchainContext } from "../../context";

setDefaultBreakpoints([{ xs: 0 }, { l: 1199 }, { xl: 1200 }]);

const NavLink = (props) => (
    <Link
        {...props}
        getProps={({ isCurrent }) => {
            // the object returned here is passed to the
            // anchor element's props
            return {
                className: isCurrent ? "active" : "non-active",
            };
        }}
    />
);

export default function Header() {
    const wallet = useWallet();
    const navigate = useNavigate();
    const [state, { dispatch }] = useBlockchainContext();
    const [openMenu1, setOpenMenu1] = useState(false);
    const [openMenu2, setOpenMenu2] = useState(false);
    const [openMenu3, setOpenMenu3] = useState(false);

    var styledAddress = wallet.account
        ? wallet.account.slice(0, 4) + "..." + wallet.account.slice(-4)
        : "Connect Wallet";

    const handleConnect = () => {
        navigate("/wallet");
    };

    const disconnect = () => {
        if (wallet.status === "connected") {
            wallet.reset();
            dispatch({
                type: "userInfo",
                payload: {},
            });
        }
    };

    const handleBtnClick1 = () => {
        setOpenMenu1(!openMenu1);
    };
    const handleBtnClick2 = () => {
        setOpenMenu2(!openMenu2);
    };
    const handleBtnClick3 = () => {
        setOpenMenu3(!openMenu3);
    };
    const closeMenu1 = () => {
        setOpenMenu1(false);
    };
    const closeMenu2 = () => {
        setOpenMenu2(false);
    };
    const closeMenu3 = () => {
        setOpenMenu3(false);
    };
    const ref1 = useOnclickOutside(() => {
        closeMenu1();
    });
    const ref2 = useOnclickOutside(() => {
        closeMenu2();
    });
    const ref3 = useOnclickOutside(() => {
        closeMenu3();
    });

    const [showmenu, btn_icon] = useState(false);

    useEffect(() => {
        const header = document.getElementById("myHeader");
        const totop = document.getElementById("scroll-to-top");
        const sticky = header.offsetTop;
        const scrollCallBack = window.addEventListener("scroll", () => {
            btn_icon(false);
            if (window.pageYOffset > sticky) {
                header.classList.add("sticky");
                totop.classList.add("show");
            } else {
                header.classList.remove("sticky");
                totop.classList.remove("show");
            }
            if (window.pageYOffset > sticky) {
                closeMenu1();
            }
        });
        return () => {
            window.removeEventListener("scroll", scrollCallBack);
        };
    }, []);

    return (
        <header id="myHeader" className="navbar white">
            <div className="container">
                <div className="row w-100-nav">
                    <div className="logo px-0">
                        <div className="navbar-title navbar-item">
                            <NavLink to="/">
                                <img
                                    src="./img/logo.png"
                                    className="img-fluid d-block"
                                    alt="#"
                                />
                                <img
                                    src="./img/logo.png"
                                    className="img-fluid d-3"
                                    alt="#"
                                />
                                <img
                                    src="./img/logo.png"
                                    className="img-fluid d-none"
                                    alt="#"
                                />
                            </NavLink>
                        </div>
                    </div>

                    <div className="search">
                        <input
                            id="quick_search"
                            className="xs-hide"
                            name="quick_search"
                            placeholder="search item here..."
                            type="text"
                        />
                    </div>

                    <BreakpointProvider>
                        <Breakpoint l down>
                            {showmenu && (
                                <div className="menu">
                                    <div className="navbar-item">
                                        <div ref={ref1}>
                                            <div
                                                className="dropdown-custom dropdown-toggle btn"
                                                onClick={handleBtnClick1}
                                            >
                                                Explore
                                            </div>
                                            {openMenu1 && (
                                                <div className="item-dropdown">
                                                    <div
                                                        className="dropdown"
                                                        onClick={closeMenu1}
                                                    >
                                                        <NavLink
                                                            to="/explore"
                                                            onClick={() =>
                                                                btn_icon(
                                                                    !showmenu
                                                                )
                                                            }
                                                        >
                                                            All NFTs
                                                        </NavLink>
                                                        <NavLink
                                                            to="/Collections"
                                                            onClick={() =>
                                                                btn_icon(
                                                                    !showmenu
                                                                )
                                                            }
                                                        >
                                                            Collection
                                                        </NavLink>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* <div className="navbar-item">
                                        <div ref={ref2}>
                                            <div
                                                className="dropdown-custom dropdown-toggle btn"
                                                onClick={handleBtnClick2}
                                            >
                                                Stats
                                            </div>
                                            {openMenu2 && (
                                                <div className="item-dropdown">
                                                    <div
                                                        className="dropdown"
                                                        onClick={closeMenu2}
                                                    >
                                                        <NavLink
                                                            to="/rangking"
                                                            onClick={() =>
                                                                btn_icon(
                                                                    !showmenu
                                                                )
                                                            }
                                                        >
                                                            Rangking
                                                        </NavLink>
                                                        <NavLink
                                                            to="/activity"
                                                            onClick={() =>
                                                                btn_icon(
                                                                    !showmenu
                                                                )
                                                            }
                                                        >
                                                            Activity
                                                        </NavLink>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="navbar-item">
                                        <div ref={ref3}>
                                            <div
                                                className="dropdown-custom dropdown-toggle btn"
                                                onClick={handleBtnClick3}
                                            >
                                                Resources
                                            </div>
                                            {openMenu3 && (
                                                <div className="item-dropdown">
                                                    <div
                                                        className="dropdown"
                                                        onClick={closeMenu3}
                                                    >
                                                        <NavLink
                                                            to="/news"
                                                            onClick={() =>
                                                                btn_icon(
                                                                    !showmenu
                                                                )
                                                            }
                                                        >
                                                            News
                                                        </NavLink>
                                                        <NavLink
                                                            to="/helpcenter"
                                                            onClick={() =>
                                                                btn_icon(
                                                                    !showmenu
                                                                )
                                                            }
                                                        >
                                                            Help Center
                                                        </NavLink>
                                                        <NavLink
                                                            to="/contact"
                                                            onClick={() =>
                                                                btn_icon(
                                                                    !showmenu
                                                                )
                                                            }
                                                        >
                                                            Contact Us
                                                        </NavLink>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div> */}
                                    <div className="navbar-item">
                                        <NavLink
                                            to="/Author"
                                            onClick={() => btn_icon(!showmenu)}
                                        >
                                            Profile
                                        </NavLink>
                                    </div>

                                    <div className="navbar-item">
                                        <NavLink
                                            to="/create"
                                            onClick={() => btn_icon(!showmenu)}
                                        >
                                            Create
                                        </NavLink>
                                    </div>
                                </div>
                            )}
                        </Breakpoint>

                        <Breakpoint xl>
                            <div className="menu">
                                <div className="navbar-item">
                                    <div ref={ref1}>
                                        <div
                                            className="dropdown-custom dropdown-toggle btn"
                                            onMouseEnter={handleBtnClick1}
                                            onMouseLeave={closeMenu1}
                                        >
                                            Explore
                                            <span className="lines"></span>
                                            {openMenu1 && (
                                                <div className="item-dropdown">
                                                    <div
                                                        className="dropdown"
                                                        onClick={closeMenu1}
                                                    >
                                                        <NavLink to="/explore">
                                                            All NFTs
                                                        </NavLink>
                                                        <NavLink to="/Collections">
                                                            Collection
                                                        </NavLink>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* <div className="navbar-item">
                                    <div ref={ref2}>
                                        <div
                                            className="dropdown-custom dropdown-toggle btn"
                                            onMouseEnter={handleBtnClick2}
                                            onMouseLeave={closeMenu2}
                                        >
                                            Stats
                                            <span className="lines"></span>
                                            {openMenu2 && (
                                                <div className="item-dropdown">
                                                    <div
                                                        className="dropdown"
                                                        onClick={closeMenu2}
                                                    >
                                                        <NavLink to="/rangking">
                                                            Rangking
                                                        </NavLink>
                                                        <NavLink to="/activity">
                                                            Activity
                                                        </NavLink>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="navbar-item">
                                    <div ref={ref3}>
                                        <div
                                            className="dropdown-custom dropdown-toggle btn"
                                            onMouseEnter={handleBtnClick3}
                                            onMouseLeave={closeMenu3}
                                        >
                                            Resources
                                            <span className="lines"></span>
                                            {openMenu3 && (
                                                <div className="item-dropdown">
                                                    <div
                                                        className="dropdown"
                                                        onClick={closeMenu3}
                                                    >
                                                        <NavLink to="/news">
                                                            News
                                                        </NavLink>
                                                        <NavLink to="/helpcenter">
                                                            Help Center
                                                        </NavLink>
                                                        <NavLink to="/contact">
                                                            Contact Us
                                                        </NavLink>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div> */}
                                <div className="navbar-item">
                                    <NavLink to="/Author">
                                        Profile
                                        <span className="lines"></span>
                                    </NavLink>
                                </div>

                                <div className="navbar-item">
                                    <NavLink to="/create">
                                        Create
                                        <span className="lines"></span>
                                    </NavLink>
                                </div>
                            </div>
                        </Breakpoint>
                    </BreakpointProvider>

                    <div className="mainside">
                        {wallet.status !== "connected" ? (
                            <button
                                className="btn-main"
                                onClick={handleConnect}
                            >
                                Connect Wallet
                            </button>
                        ) : (
                            <button className="btn-main" onClick={disconnect}>
                                {styledAddress}
                            </button>
                        )}
                    </div>
                </div>
                <button
                    className="nav-icon"
                    onClick={() => btn_icon(!showmenu)}
                >
                    <div className="menu-line white"></div>
                    <div className="menu-line1 white"></div>
                    <div className="menu-line2 white"></div>
                </button>
            </div>
        </header>
    );
}
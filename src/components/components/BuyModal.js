import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import DateTimeField from "@1stquad/react-bootstrap-datetimepicker";
import { NotificationManager } from "react-notifications";
import { useBlockchainContext } from "../../context";
import moment from "moment";

export default function BuyModal(props) {
    const { buyFlag, show, setShow, correctItem } = props;
    const [state, { checkBalances, buyNFT, bidNFT, getCurrency }] = useBlockchainContext();
    const [price, setPrice] = useState("");
    const [currency, setCurrency] = useState("BNB");
    const [date, setDate] = useState(new Date());
    const [mybalance, setMybalances] = useState(["0", "0"]);
    const [bidBtnFlag, setBidBtnFlag] = useState(true);
    const [buyBtnFlag, setBuyBtnFlag] = useState(true);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const initialDate = new Date();
        initialDate.setDate(initialDate.getDate() + 10);
        setDate(initialDate);
    }, [])

    useEffect(() => {
        const b = async () => {
            let accpetedCurrency = getCurrency(correctItem.marketdata?.acceptedToken);
            setCurrency(accpetedCurrency.label);
            let result = await checkBalances([state.currencies[0].value, accpetedCurrency.value]);
            setMybalances(result);
        };
        b();
    }, [state.auth, correctItem]);
    useEffect(() => {
        if (correctItem) {
            if (
                mybalance[0] > price &&
                price > 0 &&
                moment(date).isValid()
            ) {
                setBidBtnFlag(false);
            } else {
                setBidBtnFlag(true);
            }

            if (mybalance[0] > Number(correctItem.marketdata.price)) {
                setBuyBtnFlag(false);
            } else {
                setBuyBtnFlag(true);
            }
        }
    }, [mybalance, date, price])

    const handle = (newDate) => {
        setDate(newDate);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(state.auth.address);
        NotificationManager.success("address copied");
    };

    const handleBuy = async () => {
        try {

            setLoading(true);
            if (mybalance[0] < Number(correctItem?.marketdata.price)) {
                return;
            }

            await buyNFT({
                nftAddress: correctItem?.collectionAddress,
                assetId: correctItem?.tokenID,
                price: correctItem?.marketdata.price,
                acceptedToken: correctItem?.marketdata.acceptedToken,
            })
            NotificationManager.success("Successfully Buy NFT");
            setLoading(false);
        } catch (err) {
            console.log(err.message);
            NotificationManager.error("Buy NFT Failed");
            setLoading(false);
        }
    };

    const handleBid = async () => {
        try {
            if (!moment(date).isValid()) {
                return;
            }
            if (price < Number(correctItem?.marketdata.bidPrice)) {
                NotificationManager.error("Please increase bid price");
                return;
            }

            setLoading(true);
            await bidNFT({
                nftAddress: correctItem?.collectionAddress,
                assetId: correctItem?.tokenID,
                price: price,
                acceptedToken: correctItem?.marketdata.acceptedToken,
                expiresAt: moment(date).valueOf(),
            });
            NotificationManager.success("Successfully Bid NFT");
            setLoading(false);
        } catch (err) {
            console.log(err.message);
            NotificationManager.error("Failed Bid NFT");
            setLoading(false);
        }
    };

    return (
        <Modal
            size="lg"
            show={show}
            onHide={() => setShow(false)}
            contentClassName="add-modal-content"
            centered
        >
            {buyFlag === 1 ? (
                <>
                    <Modal.Header>
                        <Modal.Title>Buying NFT</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <span className="spacer-single"></span>
                        <h4 className="text-center">
                            You need {correctItem?.marketdata.price} {currency} +{" "}
                            <Link to="">gas fees</Link>
                        </h4>
                        <span className="spacer-10"></span>
                        <p className="text-center">
                            Buy any NFT with {currency} token. It can take up to a
                            minute for your balance update.
                        </p>
                        <span className="spacer-single"></span>
                        <div>
                            <span style={{ justifyContent: "space-between" }}>
                                <h5>Wallet Address</h5>
                                <p>Balance: {mybalance[1]} {currency}</p>
                                <p>Balance: {mybalance[0]} BNB</p>
                            </span>
                            <div
                                className="text_copy noselect"
                                style={{ color: "grey", textAlign: "left" }}
                                onClick={handleCopy}
                            >
                                <span>{state.userInfo.address}</span>
                                <span style={{ padding: "0 10px" }}>
                                    <i className="bg-color-2 i-boxed icon_pencil-edit"></i>
                                </span>
                            </div>
                        </div>
                        <div className="spacer-20"></div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="spacer-10"></div>
                        {
                            loading ? (
                                <button className="btn-main">
                                    <span
                                        className="spinner-border spinner-border-sm"
                                        aria-hidden="true"
                                    ></span>
                                </button>
                            ) : (
                                <button
                                    className="btn-main"
                                    onClick={handleBuy}
                                    disabled={buyBtnFlag}
                                >
                                    Checkout
                                </button>
                            )
                        }
                        <div className="spacer-10"></div>
                    </Modal.Footer>
                </>
            ) : (
                <>
                    <Modal.Header>
                        <Modal.Title>Make an offer</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <span className="spacer-single"></span>
                        <p className="text-center">
                            To be recommended, it must be higher than the
                            previous bid price.
                        </p>
                        <h5>Price</h5>
                        <div className="price">
                            <div
                                className="form-control"
                                style={{
                                    flex: "1 1 0",
                                }}
                            >
                                <img
                                    src="../../img/logo.png"
                                    alt=""
                                    style={{
                                        width: "25px",
                                    }}
                                />
                                <span>{currency}</span>
                            </div>
                            <input
                                type="number"
                                name="item_price"
                                id="item_price"
                                className="form-control"
                                style={{
                                    flex: "4 4 0",
                                }}
                                placeholder="Amount"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <p style={{ float: "right" }}>
                            {"Available Price: "}
                            {mybalance[0] + " " + currency}
                        </p>
                        <div className="spacer-30"></div>

                        <h5>Offer Expiration</h5>
                        <DateTimeField
                            dateTime={date}
                            onChange={handle}
                            mode={"datetime"}
                            format={"MM/DD/YYYY hh:mm A"}
                            inputFormat={"DD/MM/YYYY hh:mm A"}
                            minDate={new Date()}
                            showToday={true}
                            startOfWeek={"week"}
                            readonly
                        />
                        <div className="spacer-20"></div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="spacer-10"></div>
                        {
                            loading ? (
                                <button className="btn-main">
                                    <span
                                        className="spinner-border spinner-border-sm"
                                        aria-hidden="true"
                                    ></span>
                                </button>
                            ) : (
                                <button
                                    className="btn-main"
                                    onClick={handleBid}
                                    disabled={bidBtnFlag}
                                >
                                    Make Offer
                                </button>
                            )
                        }
                        <div className="spacer-10"></div>
                    </Modal.Footer>
                </>
            )}
        </Modal>
    );
}

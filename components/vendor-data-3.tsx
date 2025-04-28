import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

type VendorData3 = {
    country: string | null;
}

const headingStyle = "text-xl leading-1 text-textColor-tertiary w-full text-center"

const getPrice = () => {
    const priceOptions = [
        <h4 className={headingStyle}>
            $$$$
        </h4>,
        <h4 className={headingStyle}>
            <span className="text-textColor-primary">$</span>
            $$$
        </h4>,
        <h4 className={headingStyle}>
            <span className="text-textColor-primary">$$</span>
            $$
        </h4>,
        <h4 className={headingStyle}>
            <span className="text-textColor-primary">$$$</span>
            $
        </h4>,
        <h4 className={headingStyle}>
            <span className="text-textColor-primary">$$$$</span>
        </h4>,
        <h4 className={headingStyle}>
            ...
        </h4>
    ]
    const randomIndex = Math.floor(Math.random() * priceOptions.length);
    return priceOptions[randomIndex];
}

const getTariff = (country: string | null) => {
    if (country === "China") return "150%";
    if (country === "United States") return "+ 0%";
    return "...";
};

const getCountry = (country: string | null) => {
    if (country === "China") return "🇨🇳 China";
    if (country === "United States") return "🇺🇸 USA";
    return "...";
}

function VendorShowcaseImage() {
    const products = [
        {
            "src": "/images/vendor-showcase/accessory-1.webp",
            "name": "Keychain"
        },
        {
            "src": "/images/vendor-showcase/bag-1.webp",
            "name": "Bag"
        },
        {
            "src": "/images/vendor-showcase/bag-2.jpg",
            "name": "Canvas bag"
        },
        {
            "src": "/images/vendor-showcase/bag-3.webp",
            "name": "Paper bags"
        },
        {
            "src": "/images/vendor-showcase/bag-4.avif",
            "name": "Tote bags"
        },
        {
            "src": "/images/vendor-showcase/box-1.jpg",
            "name": "Boxes"
        },
        {
            "src": "/images/vendor-showcase/box-2.jpg",
            "name": "Boxes"
        },
        {
            "src": "/images/vendor-showcase/box-3.jpg",
            "name": "Packaging set"
        },
        {
            "src": "/images/vendor-showcase/box-4.jpg",
            "name": "Cartons"
        },
        {
            "src": "/images/vendor-showcase/box-5.jpg",
            "name": "Packaging"
        },
        {
            "src": "/images/vendor-showcase/box-6.webp",
            "name": "Box Tray"
        },
        {
            "src": "/images/vendor-showcase/box-7.jpg",
            "name": "Food Boxes"
        },
        {
            "src": "/images/vendor-showcase/box-8.avif",
            "name": "Small Packaging"
        },
        {
            "src": "/images/vendor-showcase/liquid-1.jpg",
            "name": "Fragrance"
        },
        {
            "src": "/images/vendor-showcase/liquid-2.webp",
            "name": "Skin Oil"
        },
        {
            "src": "/images/vendor-showcase/liquid-3.webp",
            "name": "Essential Oil"
        },
        {
            "src": "/images/vendor-showcase/packaging-1.jpg",
            "name": "Assorted Packaging"
        },
        {
            "src": "/images/vendor-showcase/packaging-2.webp",
            "name": "Bubble Bags"
        },
        {
            "src": "/images/vendor-showcase/packaging-3.jpg",
            "name": "Cosmetic Packaging"
        },
        {
            "src": "/images/vendor-showcase/packaging-4.webp",
            "name": "Cosmetic Packaging"
        },
        {
            "src": "/images/vendor-showcase/paper-1.webp",
            "name": "Insert Cards"
        },
        {
            "src": "/images/vendor-showcase/paper-2.avif",
            "name": "Insert Cards"
        },
        {
            "src": "/images/vendor-showcase/paper-3.webp",
            "name": "Flyers"
        },
        {
            "src": "/images/vendor-showcase/pills.jpg",
            "name": "Supplement Packaging"
        },
        {
            "src": "/images/vendor-showcase/puzzle-1.webp",
            "name": "Puzzle"
        },
        {
            "src": "/images/vendor-showcase/puzzle-2.jpg",
            "name": "Puzzle Set"
        },
        {
            "src": "/images/vendor-showcase/stickers-1.jpg",
            "name": "Sticker set"
        },
        {
            "src": "/images/vendor-showcase/stickers-2.png",
            "name": "Sticker Cut"
        },
        {
            "src": "/images/vendor-showcase/stickers-3.jpg",
            "name": "Stickers"
        },
        {
            "src": "/images/vendor-showcase/stickers-4.webp",
            "name": "Brand Sticker Pack"
        },
        {
            "src": "/images/vendor-showcase/stickers-5.webp",
            "name": "Sticker Pack"
        },
        {
            "src": "/images/vendor-showcase/stickers-6.jpg",
            "name": "Stickers"
        },
    ]

    const randomIndex = Math.floor(Math.random() * products.length);
    const src = products[randomIndex].src;
    const name = products[randomIndex].name;
    const randomQuantity = Math.round(Math.random() * 200) * 100;
    const randomPrice = (Math.random() * (35 - 6) + 6).toFixed(2);

    return (
        <div className="flex-1" style={{ fontSize: "10px" }}>
            <Image
                src={src}
                alt=""
                width={60}
                height={100}
                style={{
                    height: "100px",
                    width: "60px",
                    objectFit: "cover",
                    borderRadius: "2px"
                }}
                className="border mb-2"
            />
            <p className="">{name}</p>
            <p className="text-textColor-tertiary">Quantity: {randomQuantity}</p>
            <p className="text-textColor-tertiary">Cost: ${randomPrice}</p>
        </div>
    )
}

export default function VendorData3({ country }: VendorData3) {
    const tariff = getTariff(country);
    const countryString = getCountry(country);

    return (
        <div className="flex flex-col justify-between" style={{ width: "296px" }}>
            <div>
                <div
                    className="flex w-full justify-end gap-3"
                    style={{ marginBottom: "20px" }}
                >
                    <div className="px-3 border border-gray-300 rounded-lg" style={{paddingTop: "10px", paddingBottom: "8px"}}>
                        {getPrice()}
                        <p style={{fontSize: "10px"}} className="text-textColor-quaternary w-full text-center">Rough Cost</p>
                    </div>
                    <div className="px-3 border border-gray-300 rounded-lg" style={{paddingTop: "10px", paddingBottom: "8px"}}>
                        <h4 className={headingStyle}>{tariff}</h4>
                        <p style={{fontSize: "10px"}} className="text-textColor-quaternary w-full text-center">Tariff</p>
                    </div>
                    <div
                        className="px-3 border border-gray-300 rounded-lg"
                        style={{paddingTop: "10px", paddingBottom: "8px"}}
                    >
                        <h4 className={headingStyle}>{countryString}</h4>
                        <p style={{fontSize: "10px"}} className="text-textColor-quaternary w-full text-center">Country of Origin</p>
                    </div>
                </div>
                
                <div className="w-full flex flex-col gap-2">
                    <h4 className="text-textColor-tertiary">Vendor Showcase</h4>
                    <div
                        className="flex flex-row gap-2 w-full"
                    >
                        <VendorShowcaseImage/>
                        <VendorShowcaseImage/>
                        <VendorShowcaseImage/>
                        <VendorShowcaseImage/>
                    </div>
                </div>
            </div>

            <Button variant={"secondary"} style={{ marginTop: "20px" }}>
                <Link href="https://drive.google.com/file/d/1TWXfEnEg230PT9Chk_blzXWhtHuB1-g_/view?usp=sharing">Vendor Catalog</Link>
            </Button>
        </div>
    )
}
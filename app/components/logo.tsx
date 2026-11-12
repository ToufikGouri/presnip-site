import { Link } from "react-router";

import { PRODUCT_NAME } from "~/const";

export function Logo() {
    return (
        <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md font-semibold tracking-tight"
        >
            <img
                src="/icon/48.png"
                alt=""
                width={28}
                height={28}
                className="size-7"
            />
            <span className="text-lg">{PRODUCT_NAME}</span>
        </Link>
    );
}

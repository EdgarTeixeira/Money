import React from "react";

const MoneyInput = props => {
    return (
        <input
            type="text"
            className={props.className}
            id={props.id}
            name={props.name}
            placeholder={props.placeholder}
            onInput={formatMoney}
            required
        />
    );
};

function formatMoney(event) {
    let input = document.activeElement.value;
    let output = input.replace(/[\D\s._-]+/g, "").trim();

    let firstNonZero = 0;
    for (; firstNonZero < output.length; firstNonZero++) {
        if (output.charAt(firstNonZero) !== "0") break;
    }
    output = output.substring(firstNonZero);

    if (output.length === 0) output = "0.00";
    else if (output.length === 1) output = "0.0" + output;
    else if (output.length === 2) output = "0." + output;
    else {
        let size = output.length;

        if (size >= 10) {
            output = output.substr(0, size - 1);
            size = output.length;
        }

        output =
            output.substring(0, size - 2) + "." + output.substring(size - 2);
    }

    document.activeElement.value = "R$ " + output;
}

export default MoneyInput;

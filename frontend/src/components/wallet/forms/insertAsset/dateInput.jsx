import React from "react";
import Form from "react-bootstrap/Form";

// https://webdesign.tutsplus.com/tutorials/auto-formatting-input-value--cms-26745

const DateInput = props => {
    return (
        <Form.Control
            type="text"
            name={props.name}
            id={props.id}
            onInput={formatDate}
            placeholder={props.placeholder}
            required
        />
    );
};

function checkValue(str, max) {
    if (str.charAt(0) !== "0" || str === "00") {
        var num = parseInt(str);
        if (isNaN(num) || num <= 0 || num > max) num = 1;
        str =
            num > parseInt(max.toString().charAt(0)) &&
            num.toString().length === 1
                ? "0" + num
                : num.toString();
    }
    return str;
}

function formatDate(event) {
    var input = document.activeElement.value;

    if (/\D\/$/.test(input)) input = input.substr(0, input.length - 3);

    var values = input.split("/").map(function(v) {
        return v.replace(/\D/g, "");
    });

    if (values[0]) values[0] = checkValue(values[0], 12);
    if (values[1]) values[1] = checkValue(values[1], 31);

    var output = values.map(function(v, i) {
        return v.length === 2 && i < 2 ? v + " / " : v;
    });

    document.activeElement.value = output.join("").substr(0, 14);
}

export default DateInput;

import React, { Component } from "react";
import MoneyInput from "./moneyInput";
import DateInput from "./dateInput";
import TicketInput from "./ticketInput";

class TransactionForm extends Component {
    render() {
        return (
            <div>
                <form
                    className="needs-validation"
                    method={this.props.method}
                    action={this.props.action}
                    noValidate
                >
                    <div className="form-row">
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="assetTicket">Ticket</label>
                                <TicketInput
                                    id="assetTicket"
                                    name="ticket"
                                    placeholder="Asset Ticket"
                                />
                                <div className="invalid-feedback">
                                    Ticket is a required field!
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="quantity">Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    defaultValue="1"
                                    className="form-control"
                                    id="quantity"
                                    name="quantity"
                                    placeholder="0"
                                    required
                                />
                                <div className="invalid-feedback">
                                    Quantity is a required field!
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="col">
                            <label htmlFor="transactionDate">
                                Transaction Date
                            </label>
                            <DateInput
                                id="transactionDate"
                                className="form-control"
                                placeholder="mm/dd/yyyy"
                                name="transaction_date"
                            />
                            <div className="invalid-feedback">
                                Transaction Date is a required field!
                            </div>
                        </div>
                        <div className="col">
                            <label htmlFor="taxes">Taxas + Emolumentos</label>
                            <MoneyInput
                                id="taxes"
                                className="form-control"
                                placeholder="R$ 0.00"
                                name="taxes"
                            />
                            <div className="invalid-feedback">
                                Taxas + Emolumentos is a required field!
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="transactionType">
                            Transaction Type
                        </label>
                        <div className="custom-control custom-radio custom-control-inline">
                            <input
                                className="custom-control-input"
                                type="radio"
                                name="transaction_type"
                                id="inlineRadio1"
                                value="buy"
                                required
                            />
                            <label
                                className="custom-control-label"
                                htmlFor="inlineRadio1"
                            >
                                Buy
                            </label>
                        </div>
                        <div className="custom-control custom-radio custom-control-inline">
                            <input
                                className="custom-control-input"
                                type="radio"
                                name="transaction_type"
                                id="inlineRadio2"
                                value="sell"
                                required
                            />
                            <label
                                className="custom-control-label"
                                htmlFor="inlineRadio2"
                            >
                                Sell
                            </label>
                            <div className="invalid-feedback">
                                Transaction Type is a required field!
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Create
                    </button>
                </form>
            </div>
        );
    }

    componentDidMount() {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName("needs-validation");
        // Loop over them and prevent submission
        Array.prototype.filter.call(forms, function(form) {
            form.addEventListener(
                "submit",
                function(event) {
                    if (form.checkValidity() === false) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    form.classList.add("was-validated");
                },
                false
            );
        });
    }
}

export default TransactionForm;

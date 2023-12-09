import { Link, useNavigate } from "react-router-dom"
import UserService from "../services/UserService"
import React, { useEffect } from "react";
import axios from "../services/axios";

const Public = () => {

    const connect = () => {
        if(!UserService.isLoggedIn()) {
            UserService.doLogin();
        }
    }

    const checkAxios = () => {
        axios.get("http://localhost:8081/api/user/hello", {
        }).then(
            (result) => {
                console.log("result: ", result);
            }
        ).catch(console.error);
    }

    const content = (
        <section className="public">
            <header>
                <h1>Welcome to Repair Store!</h1>
            </header>
            <main>
                <p>Located in Beautiful Downtown Foo City, Repair Store provides a trained staff ready to meet your repair needs.</p>
                <p>&nbsp;</p>
                <address>
                    Repair Store<br />
                    555 Foo Drive<br />
                    Foo City, CA 12345<br />
                    <a href="tel:+15555555555">(555) 555-5555</a>
                </address>
                <button onClick={connect}>connect</button>
                <button onClick={checkAxios}>check axios</button>
            </main>
            <footer>
                <Link to="/login">Employee Login</Link>
            </footer>
        </section>

    )
    return content
}
export default Public
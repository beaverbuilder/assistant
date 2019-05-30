import React, { Fragment } from 'react'
import { MemoryRouter, Switch, Route, NavLink } from 'react-router-dom'
import './style.scss'

// Pages

export const Docs = () => {
    return (
        <MemoryRouter>
            <nav className="fl-asst-docs-nav">
                <ul>
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/buttons">Buttons</NavLink></li>
                </ul>
            </nav>
            <div>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/buttons" component={Buttons} />
                </Switch>
            </div>
        </MemoryRouter>
    )
}

const Home = () => {
    return (
        <Fragment>
            <h2>Docs</h2>
            <p>These are inline docs meant as a reference while building apps</p>
        </Fragment>
    )
}

const Buttons = () => {
    return (
        <Fragment>
            <h2>Buttons</h2>
            <p>This is a doc page about buttons.</p>
        </Fragment>
    )
}

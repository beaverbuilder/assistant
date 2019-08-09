import React from 'fl-react'
import { Switch, Route, Link } from 'fl-react-router-dom'
import { Page, List } from 'assistant/lib'

export const RoutingExample = ( { match } ) => (
	<Switch>
		<Route exact path={ `${match.url}/` } component={ Main } />
		<Route path={ `${match.url}/second` } component={ SecondaryScreen } />
	</Switch>
)

const Main = () => {
	return (
		<Page>
			<MainScreenContents />
		</Page>
	)
}

const MainScreenContents = () => {
	return (
		<List>
			<h1>Heading 1</h1>
			<h2>Heading Two</h2>
			<h3>Heading 3</h3>
			<h4>Heading Quatre</h4>
			<h5>Heading 5</h5>
			<h6>Why would anyone use a Heading 6?</h6>
			<p>Paragraph - Nullam id dolor id nibh ultricies vehicula ut id elit. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p>
			<blockquote>Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Cras mattis consectetur purus sit amet fermentum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mattis consectetur purus sit amet fermentum. Etiam porta sem malesuada magna mollis euismod. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Nullam id dolor id nibh ultricies vehicula ut id elit.</blockquote>
			<p>Paragraph - Nullam id dolor id nibh ultricies vehicula ut id elit. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p>
			<img src="https://images.unsplash.com/photo-1560406145-f34b88bff872?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60" />
			<p>Paragraph - Nullam id dolor id nibh ultricies vehicula ut id elit. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p>
			<blockquote>Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Cras mattis consectetur purus sit amet fermentum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mattis consectetur purus sit amet fermentum. Etiam porta sem malesuada magna mollis euismod. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Nullam id dolor id nibh ultricies vehicula ut id elit.</blockquote>
			<p>Paragraph - Nullam id dolor id nibh ultricies vehicula ut id elit. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p>
			<hr />
			<Link to="/fl-example-routing/second">Go To Second Screen</Link>
		</List>
	)
}

const SecondaryScreen = () => {
	return (
		<Page>
			<h1>Second Screen</h1>
			<p>Paragraph - Nullam id dolor id nibh ultricies vehicula ut id elit. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p>
			<img src="https://images.unsplash.com/photo-1560414239-dcdf7d8d0226?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60" />
			<p>Paragraph - Nullam id dolor id nibh ultricies vehicula ut id elit. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p>
		</Page>
	)
}

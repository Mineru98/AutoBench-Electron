import React from 'react';
import { Grid, Header, List } from 'semantic-ui-react';

import './Card.css';

class Card extends React.Component {
	render() {
		return(
			<div className="card recommendation">
				<Grid>
					<Grid.Column width={6}>
						<img src={this.props.imgUrl} width="150" alt="reco" />
					</Grid.Column>
					<Grid.Column width={10}>
						<List>
							<List.Item>
								<Header size='large'>
									{this.props.title}
								</Header>
							</List.Item>
							<List.Item>
								<Header size='medium'>
									{this.props.description}
								</Header>
							</List.Item>
							<List.Item>
								<Header size='medium'>
									{this.props.description}
								</Header>
							</List.Item>
						</List>
					</Grid.Column>
				</Grid>
			</div>
		);
	}
}
export default Card;
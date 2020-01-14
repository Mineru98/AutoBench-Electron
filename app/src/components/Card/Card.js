import React from 'react';
import { Grid, Header } from 'semantic-ui-react'

import './Card.css';

export class Card extends React.Component {
	render() {
		const { imgUrl, modelName } = this.props;
		return(
			<div className="card recommendation">
				<Grid>
					<Grid.Colum width={5}>
						<img src={imgUrl} className="card display" alt="display" width="150" />
					</Grid.Colum>
					<Grid.Colum width={9}>
						<Header>{modelName}</Header>
						<Header>{modelName}</Header>
						<Header>{modelName}</Header>
					</Grid.Colum>
				</Grid>
			</div>
		);
	}
}

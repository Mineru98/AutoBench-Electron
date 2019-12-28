import React from 'react';
import { Grid, Header } from 'semantic-ui-react'; 
import logo from '../../img/setting.svg';
import './Main.css';

function Main() {
	return (
		<div className="App">
			<header className="App-header">
				<Grid>
					<Grid.Row>
						<Grid.Column width={3}/>
						<Grid.Column width={5}>
							<img src={logo} className="App-logo" alt="logo" width="150"/>
							<Header size="huge">AutoBench</Header>
						</Grid.Column>
						<Grid.Column width={2}/>
						<Grid.Column verticalAlign="middle" width={5}>
							<div className="home_rounded">
								<img src="img/mainboard.png" width="30" alt="mainboard" />
							</div>
						</Grid.Column>
						<Grid.Column width={3}/>
					</Grid.Row>

					<Grid.Row>
						<Grid.Column width={3}/>
						<Grid.Column width={5}>
							<div className="home_rounded">
								<img src="img/cpu.png" width="30" alt="cpu" />
							</div>
						</Grid.Column>
						<Grid.Column width={2}/>
						<Grid.Column width={5}>
							<div className="home_rounded">
								<img src="img/gpu.png" width="30" alt="gpu" />
							</div>
						</Grid.Column>
						<Grid.Column width={3}/>
					</Grid.Row>
					
					<Grid.Row>
						<Grid.Column width={3}/>
						<Grid.Column width={5}>
							<div className="home_rounded">
								<img src="img/drive.png" width="30" alt="drive" />
							</div>
						</Grid.Column>
						<Grid.Column width={2}/>
						<Grid.Column width={5}>
							<div className="home_rounded">
								<img src="img/ram.png" width="30" alt="ram" />
							</div>
						</Grid.Column>
						<Grid.Column width={3}/>
					</Grid.Row>
				</Grid>
			</header>
		</div>
	); 
}
export default Main;
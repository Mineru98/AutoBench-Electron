import React from 'react'
import { Grid, Header, Input } from 'semantic-ui-react'
import logo from './setting.svg'
import cpuImg from '../../assets/cpu.png'
import gpuImg from '../../assets/gpu.png'
import ramImg from '../../assets/ram.png'
import driveImg from '../../assets/drive.png'
import mainboardImg from '../../assets/mainboard.png'
import './Main.css'

function Main() {
	return (
		<div className="App">
			<div className="home_frame">
				<Grid>
					<Grid.Row>
						<Grid.Column width={2}/>
						<Grid.Column width={5}>
							<img src={logo} className="App-logo" alt="logo" width="150"/>
							<Header size="huge">AutoBench</Header>
						</Grid.Column>
						<Grid.Column width={2}/>
						<Grid.Column verticalAlign="middle" width={5}>
							<div className="home_rounded">
								<img src={mainboardImg} width="30" alt="mainboard" />
							</div>
						</Grid.Column>
						<Grid.Column width={2}/>
					</Grid.Row>

					<Grid.Row  className="home_searchbar_top">
						<Grid.Column width={2}/>
						<Grid.Column width={5}>
							<div className="home_rounded">
								<Grid>
									<Grid.Row>
										<Grid.Column width={3}>
											<img id="home_icon" src={cpuImg} width="30" alt="cpu" />
										</Grid.Column>
										<Grid.Column width={12}>
											<Input placeholder='Search...' size="mini" id="home_input"/>
										</Grid.Column>
									</Grid.Row>
								</Grid>
							</div>
						</Grid.Column>
						<Grid.Column width={2}/>
						<Grid.Column width={5}>
							<div className="home_rounded">
								<img src={gpuImg} width="30" alt="gpu" />
							</div>
						</Grid.Column>
						<Grid.Column width={2}/>
					</Grid.Row>
					
					<Grid.Row className="home_searchbar_bottom">
						<Grid.Column width={2}/>
						<Grid.Column width={5}>
							<div className="home_rounded">
								<img src={driveImg} width="30" alt="drive" />
							</div>
						</Grid.Column>
						<Grid.Column width={2}/>
						<Grid.Column width={5}>
							<div className="home_rounded">
								<img src={ramImg} width="30" alt="ram" />
							</div>
						</Grid.Column>
						<Grid.Column width={2}/>
					</Grid.Row>
				</Grid>
			</div>
			<div className="home_frame2">
			</div>
		</div>
	); 
}
export default Main;
import Enum from 'enum'
import React from 'react';
import axios from 'axios';
import { Grid, Header, Modal } from 'semantic-ui-react';
import SearchInput, { createFilter } from 'react-search-input';
import ExampleComponent from "react-rounded-image";
import Slider from 'infinite-react-carousel';
import { Progress } from 'react-sweet-progress';

import ram_data from '../../assets/data/ram_data';

import logo from '../../assets/imgs/setting.svg';
import label from '../../assets/imgs/label.svg';
import cpuImg from '../../assets/imgs/cpu.png';
import gpuImg from '../../assets/imgs/gpu.png';
import ramImg from '../../assets/imgs/ram.png';
import driveImg from '../../assets/imgs/drive.png';
import mainboardImg from '../../assets/imgs/mainboard.png';
import MyPhoto from '../../assets/imgs/man.jpg';
import Crown1 from '../../assets/imgs/crown1_icon.png';

import './Main.css';

const RAM_KEYS_TO_FILTERS = ['name', 'img'];
const KEYS_TO_FILTERS = ['model_name', 'manufacturer'];
const palette = new Enum({'Red': '#E03C31', 'Orange': '#FF7F41', 'Yellow': '#F7EA48', 'Green': '#6BC078', 'Blue': '#33BEB8', 'Indigo':'#147BD1', 'Purple':'#753BBD'});

class Main extends React.Component {
	// linux & windows : hardwareinfo.index.js로 실행해서 최초 실행 시 model_name에 배치
	constructor(props) {
		super(props);
		this.state = {
			searchTerm: '',
			open_cpu: false,
			open_gpu: false,
			open_ram: false,
			open_drive: false,
			cpu_model_name: 'CPU',
			gpu_model_name: 'GPU',
			ram_model_name: 'RAM',
			drive_model_name: 'Drive',
			mainboard_model_name: 'MainBoard',
			cpu_data: [],
			gpu_data: [],
			drive_data: [],
			ram_data: [],
			mainboard: []
		};
		this.searchUpdated = this.searchUpdated.bind(this);
		this.onClickCPUModal = this.onClickCPUModal.bind(this);
		this.onClickGPUModal = this.onClickGPUModal.bind(this);
		this.onClickRAMModal = this.onClickRAMModal.bind(this);
		this.onClickDriveModal = this.onClickDriveModal.bind(this);

		this.cpu_modal = this.cpu_modal.bind(this);
		this.gpu_modal = this.gpu_modal.bind(this);
		this.ram_modal = this.ram_modal.bind(this);
		this.drive_modal = this.drive_modal.bind(this);
	}

	UNSAFE_componentWillMount() {
		axios
			.get('http://autobenchserver-hywpy.run.goorm.io/cpu')
			.then(data => {
				this.setState({
					cpu_data: data.data
				});
			})
			.catch(error => {
				console.log(error);
			});
		axios
			.get('http://autobenchserver-hywpy.run.goorm.io/gpu')
			.then(data => {
				this.setState({
					gpu_data: data.data
				});
			})
			.catch(error => {
				console.log(error);
			});
		axios
			.get('http://autobenchserver-hywpy.run.goorm.io/diskdrive')
			.then(data => {
				this.setState({
					drive_data: data.data
				});
			})
			.catch(error => {
				console.log(error);
			});
	}

	searchUpdated(term) {
		this.setState({ searchTerm: term });
	}

	onClickCPUModal(e, model_name) {
		this.setState({ open_cpu: false, cpu_model_name: model_name });
		axios
			.get('http://autobenchserver-hywpy.run.goorm.io/cpu/' + model_name)
			.then(data => {
				console.log(data.data);
			})
			.catch(error => {
				console.log(error);
			});
	}

	onClickGPUModal(e, model_name) {
		this.setState({ open_gpu: false, gpu_model_name: model_name });
		axios
			.get('http://autobenchserver-hywpy.run.goorm.io/gpu/' + model_name)
			.then(data => {
				console.log(data.data);
			})
			.catch(error => {
				console.log(error);
			});
	}

	onClickRAMModal(e, model_name) {
		this.setState({ open_ram: false, ram_model_name: model_name });
		axios
			.get('http://autobenchserver-hywpy.run.goorm.io/ram/' + model_name)
			.then(data => {
				console.log(data.data);
			})
			.catch(error => {
				console.log(error);
			});
	}

	onClickDriveModal(e, model_name) {
		this.setState({ open_drive: false, drive_model_name: model_name });
		axios
			.get('http://autobenchserver-hywpy.run.goorm.io/diskdrive/' + model_name)
			.then(data => {
				console.log(data.data);
			})
			.catch(error => {
				console.log(error);
			});
	}

	cpu_modal() {
		this.setState({
			open_cpu: !this.state.open_cpu
		});
	}

	gpu_modal() {
		this.setState({
			open_gpu: !this.state.open_gpu
		});
	}

	ram_modal() {
		this.setState({
			open_ram: !this.state.open_ram
		});
	}

	drive_modal() {
		this.setState({
			open_drive: !this.state.open_drive
		});
	}

	render() {
		const {
			open_cpu,
			open_gpu,
			open_ram,
			open_drive,
			cpu_model_name,
			gpu_model_name,
			ram_model_name,
			drive_model_name,
			mainboard_model_name,
			cpu_data,
			gpu_data,
			drive_data
		} = this.state;

		let cpu_filter = cpu_data.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));
		let gpu_filter = gpu_data.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));
		let drive_filter = drive_data.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));
		let ram_filter = ram_data.filter(createFilter(this.state.searchTerm, RAM_KEYS_TO_FILTERS));

		return (
			<div className="Home">
				<div className="HomeBanner1_1">
					<Grid>
						<Grid.Row>
							<Grid.Column width={2} />
							<Grid.Column width={5} id="home_logo">
								<img src={logo} className="App-logo" alt="logo" width="150" />
								<Header size="huge">AutoBench</Header>
							</Grid.Column>
							<Grid.Column width={2} />
							<Grid.Column verticalAlign="middle" width={5}>
								<div className="home_rounded">
									<Grid>
										<Grid.Row>
											<Grid.Column width={3}>
												<img src={mainboardImg} width="30" alt="mainboard" />
											</Grid.Column>
											<Grid.Column width={12}>
												<Header color="grey" id="home_text" as="h3">
													{mainboard_model_name}
												</Header>
											</Grid.Column>
										</Grid.Row>
									</Grid>
								</div>
							</Grid.Column>
							<Grid.Column width={2} />
						</Grid.Row>

						<Grid.Row className="home_searchbar_top">
							<Grid.Column width={2} />
							<Grid.Column width={5}>
								<div className="home_rounded">
									<Grid>
										<Grid.Row>
											<Grid.Column width={3}>
												<img id="home_icon" src={cpuImg} width="30" alt="cpu" />
											</Grid.Column>
											<Grid.Column width={12}>
												<Modal
													closeIcon
													onClose={this.cpu_modal}
													size="small"
													open={open_cpu}
													trigger={
														<Header color="grey" id="home_text" as="h3" onClick={this.cpu_modal}>
															{cpu_model_name}
														</Header>
													}
												>
													<Modal.Header>Search CPU Model</Modal.Header>
													<Modal.Content scrolling>
														<SearchInput className="search-input" onChange={this.searchUpdated} />
														{cpu_filter.map(cpu => {
															return (
																<div
																	className="mail"
																	key={cpu.rank}
																	onClick={e => this.onClickCPUModal(e, cpu.model_name)}
																>
																	<table>
																		<tbody>
																			<tr>
																				<td>
																					<img src={cpu.img} alt="cpu_model" />
																				</td>
																				<td>{cpu.model_name}</td>
																			</tr>
																		</tbody>
																	</table>
																</div>
															);
														})}
													</Modal.Content>
												</Modal>
											</Grid.Column>
										</Grid.Row>
									</Grid>
								</div>
							</Grid.Column>
							<Grid.Column width={2} />
							<Grid.Column width={5}>
								<div className="home_rounded">
									<Grid>
										<Grid.Row>
											<Grid.Column width={3}>
												<img src={gpuImg} width="30" alt="gpu" />
											</Grid.Column>
											<Grid.Column width={12}>
												<Modal
													closeIcon
													onClose={this.gpu_modal}
													size="small"
													open={open_gpu}
													trigger={
														<Header color="grey" id="home_text" as="h3" onClick={this.gpu_modal}>
															{gpu_model_name}
														</Header>
													}
												>
													<Modal.Header>Search GPU Model</Modal.Header>
													<Modal.Content scrolling>
														<SearchInput className="search-input" onChange={this.searchUpdated} />
														{gpu_filter.map(gpu => {
															return (
																<div
																	className="mail"
																	key={gpu.rank}
																	onClick={e => this.onClickGPUModal(e, gpu.model_name)}
																>
																	<table>
																		<tbody>
																			<tr>
																				<td>
																					<img src={gpu.img} alt="gpu_model" />
																				</td>
																				<td>{gpu.model_name}</td>
																			</tr>
																		</tbody>
																	</table>
																</div>
															);
														})}
													</Modal.Content>
												</Modal>
											</Grid.Column>
										</Grid.Row>
									</Grid>
								</div>
							</Grid.Column>
							<Grid.Column width={2} />
						</Grid.Row>

						<Grid.Row className="home_searchbar_bottom">
							<Grid.Column width={2} />
							<Grid.Column width={5}>
								<div className="home_rounded">
									<Grid>
										<Grid.Row>
											<Grid.Column width={3}>
												<img src={driveImg} width="30" alt="drive" />
											</Grid.Column>
											<Grid.Column width={12}>
												<Modal
													closeIcon
													onClose={this.drive_modal}
													size="small"
													open={open_drive}
													trigger={
														<Header color="grey" id="home_text" as="h3" onClick={this.drive_modal}>
															{drive_model_name}
														</Header>
													}
												>
													<Modal.Header>Search Drive Model</Modal.Header>
													<Modal.Content scrolling>
														<SearchInput className="search-input" onChange={this.searchUpdated} />
														{drive_filter.map(drive => {
															return (
																<div
																	className="mail"
																	key={drive.rank}
																	onClick={e => this.onClickDriveModal(e, drive.model_name)}
																>
																	<table>
																		<tbody>
																			<tr>
																				<td>
																					<img src={drive.img} alt="drive_model" />
																				</td>
																				<td>{drive.model_name}</td>
																			</tr>
																		</tbody>
																	</table>
																</div>
															);
														})}
													</Modal.Content>
												</Modal>
											</Grid.Column>
										</Grid.Row>
									</Grid>
								</div>
							</Grid.Column>
							<Grid.Column width={2} />
							<Grid.Column width={5}>
								<div className="home_rounded">
									<Grid>
										<Grid.Row>
											<Grid.Column width={3}>
												<img src={ramImg} width="30" alt="ram" />
											</Grid.Column>
											<Grid.Column width={12}>
												<Modal
													size="small"
													closeIcon
													onClose={this.ram_modal}
													open={open_ram}
													trigger={
														<Header color="grey" id="home_text" as="h3" onClick={this.ram_modal}>
															{ram_model_name}
														</Header>
													}
												>
													<Modal.Header>Search RAM Model</Modal.Header>
													<Modal.Content scrolling>
														<SearchInput className="search-input" onChange={this.searchUpdated} />
														{ram_filter.map(ram => {
															return (
																<div
																	className="mail"
																	key={ram.rank}
																	onClick={e => this.onClickRAMModal(e, ram.name)}
																>
																	<table>
																		<tbody>
																			<tr>
																				<td>
																					<img src={ram.img} alt="ram_model" />
																				</td>
																				<td>{ram.name}</td>
																			</tr>
																		</tbody>
																	</table>
																</div>
															);
														})}
													</Modal.Content>
												</Modal>
											</Grid.Column>
										</Grid.Row>
									</Grid>
								</div>
							</Grid.Column>
							<Grid.Column width={2} />
						</Grid.Row>
					</Grid>
				</div>
				<div className="HomeBanner1_2" />
				<div className="HomeBanner2">
					<div className="HomeRank">
						<img id="Crown" src={Crown1} alt="crown1" width="64" />
						<ExampleComponent
							image={MyPhoto}
							roundedColor="#000000"
							imageWidth="64"
							imageHeight="64"
							roundedSize="5"
						/>
					</div>
					<div className="HomeTotalLabel">
						<img src={label} alt="label" width="120" />
						<div class="text-centered">No. 1201</div>
					</div>
					<div className="HomeScore">
						<Grid>
							<Grid.Row columns={2}>
								<Grid.Column>
									<div className="HomeHardware CPU">
										{/*css width 값 조절 필요*/}
										<Progress percent={88} theme={{active: {symbol: '40,000',color: palette.Red.value}}} />
										<Progress percent={88} theme={{active: {symbol: '40,000',color: palette.Orange.value}}} />
										<Progress percent={88} theme={{active: {symbol: '40,000',color: palette.Yellow.value}}} />
										<Progress percent={88} theme={{active: {symbol: '40,000',color: palette.Green.value}}} />
										<Progress percent={88} theme={{active: {symbol: '40,000',color: palette.Blue.value}}} />
									</div>
								</Grid.Column>
								<Grid.Column>
									<div className="HomeHardware GPU">
									</div>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row columns={2}>
								<Grid.Column>
									<div className="HomeHardware Drive"></div>
								</Grid.Column>
								<Grid.Column>
									<div className="HomeHardware RAM"></div>
								</Grid.Column>
							</Grid.Row>
						</Grid>
					</div>
				</div>
				<div className="HomeBanner3">
					
					<div>
						<Slider arrows={false} autoplay={true} dots={true}>
							<div>
								<h3>1</h3>
							</div>
							<div>
								<h3>2</h3>
							</div>
							<div>
								<h3>3</h3>
							</div>
							<div>
								<h3>4</h3>
							</div>
						</Slider>
					</div>
				</div>
			</div>
		);
	}
}
export default Main;
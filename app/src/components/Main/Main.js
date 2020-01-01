import React from 'react'
import { Grid, Header, Modal } from 'semantic-ui-react'
import SearchInput, {createFilter} from 'react-search-input';

import cpu_data from '../../assets/data/cpu_data';
import gpu_data from '../../assets/data/gpu_data';
import ram_data from '../../assets/data/ram_data';
import drive_data from '../../assets/data/drive_data';

import logo from '../../assets/imgs/setting.svg'
import cpuImg from '../../assets/imgs/cpu.png'
import gpuImg from '../../assets/imgs/gpu.png'
import ramImg from '../../assets/imgs/ram.png'
import driveImg from '../../assets/imgs/drive.png'
import mainboardImg from '../../assets/imgs/mainboard.png'
import './Main.css'

const KEYS_TO_FILTERS = ['name', 'img'];

class Main extends React.Component {
	
	constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
			open_cpu: false,
			open_gpu: false,
			open_ram: false,
			open_drive: false,
			cpu_model_name: "CPU",
			gpu_model_name: "GPU",
			ram_model_name: "RAM",
			drive_model_name: "Drive",
			mainboard_model_name: "MainBoard"
    }
    this.searchUpdated = this.searchUpdated.bind(this)
    this.onClickCPUModal = this.onClickCPUModal.bind(this)
		this.onClickGPUModal = this.onClickGPUModal.bind(this)
		this.onClickRAMModal = this.onClickRAMModal.bind(this)
		this.onClickDriveModal = this.onClickDriveModal.bind(this)
		
		this.cpu_modal = this.cpu_modal.bind(this)
		this.gpu_modal = this.gpu_modal.bind(this)
		this.ram_modal = this.ram_modal.bind(this)
		this.drive_modal = this.drive_modal.bind(this)
  }

  searchUpdated (term) {
    this.setState({searchTerm: term})
  }
  
  onClickCPUModal(e, name) {
		this.setState({open_cpu:false, cpu_model_name: name})
  }
	
	onClickGPUModal(e, name) {
		this.setState({open_gpu:false, gpu_model_name: name})
  }
	
	onClickRAMModal(e, name) {
		this.setState({open_ram:false, ram_model_name: name})
  }
	
	onClickDriveModal(e, name) {
		this.setState({open_drive:false, drive_model_name: name})
  }
	
	cpu_modal() {
		this.setState({
			open_cpu: !this.state.open_cpu
		})
	}
	gpu_modal() {
		this.setState({
			open_gpu: !this.state.open_gpu
		})
	}
	
	ram_modal() {
		this.setState({
			open_ram: !this.state.open_ram
		})
	}
	
	drive_modal() {
		this.setState({
			open_drive: !this.state.open_drive
		})
	}
	
	render() {
		const cpu_filter = cpu_data.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
		const gpu_filter = gpu_data.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
		const ram_filter = ram_data.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
		const drive_filter = drive_data.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
		
		const { open_cpu, open_gpu, open_ram, open_drive, cpu_model_name, gpu_model_name, ram_model_name, drive_model_name, mainboard_model_name } = this.state
		
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
									<Grid>
										<Grid.Row>
											<Grid.Column width={3}>
												<img src={mainboardImg} width="30" alt="mainboard" />
											</Grid.Column>
											<Grid.Column width={12}>
												<Header color="grey" id="home_text" as='h3'>{mainboard_model_name}</Header>
											</Grid.Column>
										</Grid.Row>
									</Grid>
								</div>
							</Grid.Column>
							<Grid.Column width={2}/>
						</Grid.Row>

						<Grid.Row className="home_searchbar_top">
							<Grid.Column width={2}/>
							<Grid.Column width={5}>
								<div className="home_rounded">
									<Grid>
										<Grid.Row>
											<Grid.Column width={3}>
												<img id="home_icon" src={cpuImg} width="30" alt="cpu" />
											</Grid.Column>
											<Grid.Column width={12}>
												<Modal closeIcon onClose={this.cpu_modal} size="small" open={open_cpu} trigger={<Header color="grey" id="home_text" as='h3' onClick={this.cpu_modal}>{cpu_model_name}</Header>}>
													<Modal.Header>Search CPU Model</Modal.Header>
													<Modal.Content scrolling>
														<SearchInput className="search-input" onChange={this.searchUpdated} />
															{cpu_filter.map(cpu => {
																return (
																	<div className="mail" key={cpu.rank} onClick={(e) => this.onClickCPUModal(e, cpu.name)}>
																		<tr>
																			<td><img src={cpu.img} alt="cpu_model"/></td>
																			<td>{cpu.name}</td>
																		</tr>
																	</div>
																)
															})}
													</Modal.Content>
												</Modal>
											</Grid.Column>
										</Grid.Row>
									</Grid>
								</div>
							</Grid.Column>
							<Grid.Column width={2}/>
							<Grid.Column width={5}>
								<div className="home_rounded">
									<Grid>
										<Grid.Row>
											<Grid.Column width={3}>
												<img src={gpuImg} width="30" alt="gpu" />
											</Grid.Column>
											<Grid.Column width={12}>
												<Modal closeIcon onClose={this.gpu_modal} size="small" open={open_gpu} trigger={<Header color="grey" id="home_text" as='h3' onClick={this.gpu_modal}>{gpu_model_name}</Header>}>
													<Modal.Header>Search GPU Model</Modal.Header>
													<Modal.Content scrolling>
														<SearchInput className="search-input" onChange={this.searchUpdated} />
															{gpu_filter.map(gpu => {
																return (
																	<div className="mail" key={gpu.rank} onClick={(e) => this.onClickGPUModal(e, gpu.name)}>
																		<tr>
																			<td><img src={gpu.img} alt="gpu_model"/></td>
																			<td>{gpu.name}</td>
																		</tr>
																	</div>
																)
															})}
													</Modal.Content>
												</Modal>
											</Grid.Column>
										</Grid.Row>
									</Grid>
								</div>
							</Grid.Column>
							<Grid.Column width={2}/>
						</Grid.Row>

						<Grid.Row className="home_searchbar_bottom">
							<Grid.Column width={2}/>
							<Grid.Column width={5}>
								<div className="home_rounded">
									<Grid>
										<Grid.Row>
											<Grid.Column width={3}>
												<img src={driveImg} width="30" alt="drive" />
											</Grid.Column>
											<Grid.Column width={12}>
												<Modal closeIcon onClose={this.drive_modal} size="small" open={open_drive} trigger={<Header color="grey" id="home_text" as='h3' onClick={this.drive_modal}>{drive_model_name}</Header>}>
													<Modal.Header>Search Drive Model</Modal.Header>
													<Modal.Content scrolling>
														<SearchInput className="search-input" onChange={this.searchUpdated} />
															{drive_filter.map(drive => {
																return (
																	<div className="mail" key={drive.rank} onClick={(e) => this.onClickDriveModal(e, drive.name)}>
																		<tr>
																			<td><img src={drive.img} alt="drive_model"/></td>
																			<td>{drive.name}</td>
																		</tr>
																	</div>
																)
															})}
													</Modal.Content>
												</Modal>
											</Grid.Column>
										</Grid.Row>
									</Grid>
								</div>
							</Grid.Column>
							<Grid.Column width={2}/>
							<Grid.Column width={5}>
								<div className="home_rounded">
									<Grid>
										<Grid.Row>
											<Grid.Column width={3}>
												<img src={ramImg} width="30" alt="ram" />
											</Grid.Column>
											<Grid.Column width={12}>
												
												<Modal size="small" closeIcon onClose={this.ram_modal} open={open_ram} trigger={<Header color="grey" id="home_text" as='h3' onClick={this.ram_modal}>{ram_model_name}</Header>}>
													<Modal.Header>Search RAM Model</Modal.Header>
													<Modal.Content scrolling>
														<SearchInput className="search-input" onChange={this.searchUpdated} />
															{ram_filter.map(ram => {
																return (
																	<div className="mail" key={ram.rank} onClick={(e) => this.onClickRAMModal(e, ram.name)}>
																		<tr>
																			<td><img src={ram.img} alt="ram_model"/></td>
																			<td>{ram.name}</td>
																		</tr>
																	</div>
																)
															})}
													</Modal.Content>
												</Modal>
											</Grid.Column>
										</Grid.Row>
									</Grid>
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
}
export default Main;
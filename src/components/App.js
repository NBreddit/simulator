import React, { Component } from 'react';
import _ from 'lodash'
import { Grid, Jumbotron, Button, Row, Col, Panel } from 'react-bootstrap';
import './App.css';
import Api from '../utils/Api';
import Summon from '../utils/Summon';
import Dropdown from './Dropdown';
import ResultsGrid from './ResultsGrid';
import Header from './Header';
import Single from '../images/single.png';
import Multi from '../images/multi.png';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      versionSelection: '',
      bannerSelection: '',
      versionOptions: [{name:'Global',value:'globalMain'},{name:'Japan',value:'japanMain'}],
      bannerOptions: [''],
      bannerRates: [],
      results: [],
      allResults: [],
      bannerUrl: '',
      type: 'Standard',
      totalPearls: 0,
      ssrCount: 0,
      srCount: 0,
      rCount: 0,
      otherCount: 0
    };
    this.handleVersionSelect = this.handleVersionSelect.bind(this);
    this.handleBannerSelect = this.handleBannerSelect.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);
    this.handleClearSummons = this.handleClearSummons.bind(this);
    this.single = this.single.bind(this);
    this.multi = this.multi.bind(this);
    this.setUnitCounts = this.setUnitCounts.bind(this);
    this.handleSetType = this.handleSetType.bind(this);

    let self = this;

    Api
    .getBanners()
    .then(function(data) {
      var options = [];

      for (var [key, value] of Object.entries(data)) {
        options.push({name:key, value:new Date(value)});
      }

      self.setState({
        bannerOptions: _.orderBy(options, ['value'], ['desc'])
      })
    });
  }

  handleSetType(newValue) {
    this.setState({ type: newValue });
  }

  handleClearForm(e) {
    e.preventDefault();
    this.setState({
      results: [],
      allResults: [],
      totalPearls: 0,
      ssrCount: 0,
      srCount: 0,
      rCount: 0,
      otherCount: 0,
      type: 'Standard',
      bannerUrl: '',
      bannerSelection: '',
      bannerRates: []
    });
  }

  handleClearSummons(e) {
    e.preventDefault();
    var resetRateCount = this.state.bannerRates;
    for (var i = 0, len = resetRateCount.length; i < len; i++) {
      resetRateCount[i].count = 0;
    }

    this.setState({
      results: [],
      allResults: [],
      totalPearls: 0,
      ssrCount: 0,
      srCount: 0,
      rCount: 0,
      otherCount: 0,
      bannerRates: resetRateCount
    });
  }

  handleVersionSelect(e) {
    let self = this;
    var version = 'globalMain';

    Api
      .getBanners(version)
      .then(function(data) {
        var options = [];

        for (var [key, value] of Object.entries(data)) {
          options.push({name:key, value:new Date(value)});
        }

        self.setState({
          bannerOptions: _.orderBy(options, ['value'], ['desc'])
        })
    });
  }

  handleBannerSelect(e) {
    let self = this;
    var bannerId = e.target.value.substr(0,e.target.value.indexOf(' '));
    var banner = '/Simulator/configuration/banners/'  +	bannerId + '.png';

    self.setState({
      bannerSelection: e.target.value,
      bannerUrl: banner
     });

    Api
      .getRates(bannerId, self.state.versionSelection)
      .then(function(data) {
        self.setState({ bannerRates: data })
    });
  }

  single() {
    var unit = Summon.Single(this.state.bannerRates);
    this.setUnitCounts(unit, 5);
  }

  multi() {
    var units = Summon.Multi(this.state.bannerRates, this.state.type);
    this.setUnitCounts(units, 50);
  }

  setUnitCounts(units, pearls) {
    var countSSRs = 0, countSRs = 0, countRs = 0;
    for(var i=0; i<=units.length-1; i++)
    {
      if (units[i].sort <= 1) {
        countSSRs++;
      }
      else if (units[i].sort === 2) {
        countSRs++;
      }
      else if (units[i].sort === 3) {
        countRs++;
      }
    }
    this.setState({
      results: units,
      totalPearls: this.state.totalPearls + pearls,
      allResults: _.orderBy(Summon.Compress(this.state.allResults.concat(units)), ['type','sort','count'],['asc','asc','desc']),
      ssrCount: this.state.ssrCount + countSSRs,
      srCount: this.state.srCount + countSRs,
      rCount: this.state.rCount + countRs
    });
  }

  render() {
    return (
      <div>
        <Header/>
        <Jumbotron className="top-margin">
          <Grid>
            <Row className="show-grid">
              <Col xs={12} md={6}>
                  <Dropdown
                    name='Select Banner'
                    placeholder={'Choose your banner'}
                    controlFunc={this.handleBannerSelect}
                    options={this.state.bannerOptions}
                    selectedOption={this.state.bannerSelection} />
                {/*this.state.bannerSelection !== '' ? (
                  <ButtonToolbar>
                    <ToggleButtonGroup type="radio" name="options" value={this.state.type} onChange={this.handleSetType}>
                      <ToggleButton value='Standard'>Standard</ToggleButton>
                      <ToggleButton value='GSSR'>GSSR</ToggleButton>
                      <ToggleButton value='fGSSR'>Featured GSSR</ToggleButton>
                    </ToggleButtonGroup>
                  </ButtonToolbar>
                  ) : null
                */}
              </Col>
              {this.state.bannerSelection !== '' ? (
                <Col xs={12} md={6}>
                  <img src={this.state.bannerUrl} className="App-image" alt="" /><br/>
                </Col>
              ) : null}
            </Row>
            {this.state.bannerSelection !== '' ? (
              <Row className="show-grid">
                <Col xs={12} md={6}>
                  <input type="image" onClick={this.single} className="App-image" src={Single} alt="Do a single summon!" />
                  <input type="image"  onClick={this.multi} className="App-image" src={Multi} alt="Do a multi summon!" />
                </Col>
              </Row>
              ) : null
            }
            {this.state.totalPearls !== 0 ? (
              <Grid>
                <Row className="show-grid">
                <Col xs={12} md={2}
                    ><Button bsStyle="warning" onClick={this.handleClearSummons}>Reset Summons Only</Button>
                  </Col>
                  <Col xs={12} md={2}
                    ><Button bsStyle="danger" onClick={this.handleClearForm}>Reset All</Button>
                  </Col>
                  <Col xs={12} md={8}>
                  <b>Summon Data - </b> Total Unit: {(this.state.totalPearls/5)},
                        5* %: {(this.state.ssrCount/this.state.totalPearls*500).toFixed(2)},
                        4* %: {(this.state.srCount/this.state.totalPearls*500).toFixed(2)},
                        3* %: {(this.state.rCount/this.state.totalPearls*500).toFixed(2)}
                  </Col>
                </Row>
                <Row className="show-grid">
                  <Col xs={12} md={6}>
                    <Panel header="Summon Results" bsStyle="primary">
                      <ResultsGrid items={_.chunk(this.state.results, 5)} type='current' />
                    </Panel>
                  </Col>
                  <Col xs={12} md={6}>
                    <Panel header={this.state.allResults.length + " unique units summoned in " + this.state.totalPearls + " Pearls used"} bsStyle="primary">
                      <ResultsGrid items={_.chunk(this.state.allResults, 5)} type='all' />
                    </Panel>
                  </Col>
                </Row>
              </Grid>
              ) : null
            }
          </Grid>
        </Jumbotron>
      </div>
    );
  }
}

export default App;

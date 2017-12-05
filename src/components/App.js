import React, { Component } from 'react';
import _ from 'lodash'
import { Grid, Jumbotron, Button, Row, Col, Panel, ButtonToolbar, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
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
      totalStones: 0,
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
    this.setCardCounts = this.setCardCounts.bind(this);
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
      totalStones: 0,
      ssrCount: 0,
      srCount: 0,
      rCount: 0,
      otherCount: 0,
      type: 'Standard',
      bannerUrl: '',
      versionSelection: '',
      bannerSelection: '',
      bannerOptions: [''],
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
      totalStones: 0,
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
    var banner = 'http://www.dbzdokkanstats.com/gachas/banners/gasha_top_banner_00' +	bannerId + '.png';
    if (self.state.versionSelection === 'Japan') {
      banner = 'http://www.dbzdokkanstats.com/jpngachas/banners/gasha_top_banner_00' +	bannerId + '.png';
    }

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
    var card = Summon.Single(this.state.bannerRates);
    this.setCardCounts(card, 5);
  }

  multi() {
    var cards = Summon.Multi(this.state.bannerRates, this.state.type);
    this.setCardCounts(cards, 50);
  }

  setCardCounts(cards, stones) {
    var countSSRs = 0, countSRs = 0, countRs = 0;
    for(var i=0; i<=cards.length-1; i++)
    {
      if (cards[i].sort <= 1) {
        countSSRs++;
      }
      else if (cards[i].sort === 2) {
        countSRs++;
      }
      else if (cards[i].sort === 3) {
        countRs++;
      }
    }
    this.setState({ 
      results: cards,
      totalStones: this.state.totalStones + stones,
      allResults: _.orderBy(Summon.Compress(this.state.allResults.concat(cards)), ['type','sort','count'],['asc','asc','desc']),
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
                {this.state.bannerSelection !== '' ? (
                  <ButtonToolbar>
                    <ToggleButtonGroup type="radio" name="options" value={this.state.type} onChange={this.handleSetType}>
                      <ToggleButton value='Standard'>Standard</ToggleButton>
                      <ToggleButton value='GSSR'>GSSR</ToggleButton>
                      <ToggleButton value='fGSSR'>Featured GSSR</ToggleButton>
                    </ToggleButtonGroup>
                  </ButtonToolbar>
                  ) : null
                }
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
            {this.state.totalStones !== 0 ? (
              <Grid>
                <Row className="show-grid">
                <Col xs={12} md={2}
                    ><Button bsStyle="warning" onClick={this.handleClearSummons}>Reset Summons Only</Button>
                  </Col>
                  <Col xs={12} md={2}
                    ><Button bsStyle="danger" onClick={this.handleClearForm}>Reset All</Button>
                  </Col>
                  <Col xs={12} md={8}>
                  <b>Summon Data - </b> Total Cards: {(this.state.totalStones/5)}, 
                        SSR %: {(this.state.ssrCount/this.state.totalStones*500).toFixed(2)}, 
                        SR %: {(this.state.srCount/this.state.totalStones*500).toFixed(2)}, 
                        R %: {(this.state.rCount/this.state.totalStones*500).toFixed(2)}
                  </Col>
                </Row>
                <Row className="show-grid">
                  <Col xs={12} md={6}>
                    <Panel header="Summon Results" bsStyle="primary">
                      <ResultsGrid items={_.chunk(this.state.results, 5)} type='current' />
                    </Panel>
                  </Col>
                  <Col xs={12} md={6}>
                    <Panel header={this.state.allResults.length + " unique cards summoned in " + this.state.totalStones + " stones used"} bsStyle="primary">
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

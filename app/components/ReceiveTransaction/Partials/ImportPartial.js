import React, { Component } from 'react';
import { Collapse } from 'react-collapse';
import PropTypes from 'prop-types';
import { traduction } from '../../../lang/lang';
import WalletService from '../../../services/wallet.service';
const lang = traduction();
const event = require('../../../utils/eventhandler');


const dialog = require('electron').remote.require('electron').dialog;

class ImportPartial extends React.Component {
  static propTypes = {
    isOpened: PropTypes.bool
  };

  static defaultProps = {
    isOpened: false
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpened: this.props.isOpened,
      privateKey: ''
    };
    this.importWallet = this.importWallet.bind(this);
    this._handleGenericFormChange = this._handleGenericFormChange.bind(this);
    this.importPrivateKey = this.importPrivateKey.bind(this);
  }

  importWallet() {
    dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        {name: 'data', extensions: ['dat']}
      ]
    }, (file) => {
      if (file === undefined) {
        event.emit('animate', lang.noFolderSelected);
        return;
      } else {
        WalletService.importWallet(String(file)).then((response) => {
          if (response === null) {
            event.emit('animate', 'Wallet Imported');
          } else {
            event.emit('animate', 'An Error Occurred');
          }
          return true;
        }).catch((error) => {
          console.log(error);
        });
      }
    });
  }

  _handleGenericFormChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
  }

  importPrivateKey() {
    WalletService.importPrivateKey(String(this.state.privateKey)).then((response) => {
      if (response === null) {
        event.emit('animate',lang.keyImported);
      } else {
        event.emit('animate', 'An Error Occurred');
      }

      return true;
    }).catch((error) => {
      event.emit('animate', error.message);
      console.log(error);
    });
    this.state.privateKey = '';
    this.refs.key.value = '';
  }

  render() {

    return (
      <div>
          <div className="col-md-12">

            <Collapse isOpened={this.props.isOpened}>
              <div className="panel panel-default">
                <div className="panel-body">
                  <div className="row">
                  <div className="col-md-12">
                    <div className="col-md-8">
                      <div>
                        <input
                          className="inpuText form-control"
                          onChange={this._handleGenericFormChange}
                          value={this.state.privateKey}
                          name="privateKey"
                          placeholder="Insert Private key"
                          type="text"
                          ref="key"
                        />
                      </div>
                      <span style={{ color: 'red' }}><b>{lang.walletUnresponsive}</b></span>
                    </div>
                    <div className="col-md-4">

                      <button className="greenBtn btn btn-success btn-raised pull-right" type="button" onClick={this.importPrivateKey} >{lang.importPrivKey}</button>
                    </div>
                  </div>

                  </div>
                </div>
              </div>
            </Collapse>
          </div>
      </div>
    );
  }
}

export default ImportPartial;
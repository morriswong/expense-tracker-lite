import React, { Component } from 'react';
import { Record, Currencies } from '../data';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import FormField from './FormField';
import PropTypes from 'prop-types';

const ButtonStyle = {
  margin: '.5em',
};

class ExpenseForm extends Component {
  constructor(props) {
    super(props);
    const { defaults } = this.props;
    this.state = {
      currency: {key: defaults.currency, text: Currencies[defaults.currency]},
      category: defaults.category,
      amount: '',
      details: '',
      dirtyCategory: false
    };
    this.handleAddIncome = this.handleAddIncome.bind(this);
    this.handleAddOutcome = this.handleAddOutcome.bind(this);
  }

  componentWillMount() {
    const host = localStorage.getItem('expenseHoodieHost');
    const user = localStorage.getItem('expenseHoodieUser');
    const pass = localStorage.getItem('expenseHoodiePass');
    if (host) {
      this.props.handleInitHoodie({host: host, user: user, pass: pass});
    }
  }

  handleAddIncome() {
    const roundedAmount = Math.round(parseFloat(this.state.amount) * 100.0) / 100.0;
    if (!isNaN(roundedAmount) && roundedAmount !== 0.0) {
      this.props.handleAddRecord({
        details: this.state.details,
        amount: roundedAmount,
        currency: this.state.currency.key,
        categoryUuid: this.state.category.key,
        mode: Record.INCOME
      });
      this.setState({
        details: '',
        amount: ''
      });
    }
    else
      alert('幾多呀？比個數啦大佬！');
  }

  handleAddOutcome() {
    const roundedAmount = Math.round(parseFloat(this.state.amount) * 100.0) / 100.0;
    if (!isNaN(roundedAmount) && roundedAmount !== 0.0) {
      this.props.handleAddRecord({
        details: this.state.details,
        amount: roundedAmount,
        currency: this.state.currency.key,
        categoryUuid: this.state.category.key,
        mode: Record.OUTCOME
      });
      this.setState({
        details: '',
        amount: ''
      });
    }
    else
      alert('幾多呀？比個數啦大佬！');
  }

  categoryKeyFromProps() {
    if (this.state.category === null) {
      const firstCategoryKey = Object.keys(this.props.categories)[0];
      return firstCategoryKey;
    } else {
      return this.state.category.key;
    }
  }

  componentWillReceiveProps({categories}) {
    const categoryKeys = Object.keys(categories);
    const shouldUseDefault = !this.state.dirtyCategory &&
      this.props.defaults.category &&
      categoryKeys.indexOf(this.props.defaults.category.key) !== -1;
    if (shouldUseDefault) {
      this.setState({
        category: this.props.defaults.category
      });
    } else {
      if (this.state.category === null || categoryKeys.indexOf(this.state.category.key) === -1) {
        const firstCategoryKey = categoryKeys[0];
        this.setState({category: {
          key: firstCategoryKey,
          text: categories[firstCategoryKey].name
        }});
      }
    }
  }

  render() {
    const { categories } = this.props;
    return (
      <section>
        <FormField>
          <Dropdown
            label='貨幣'
            onChanged={(currency)=> this.setState({currency})}
            selectedKey={this.state.currency.key}
            options={Currencies}
          />
        </FormField>
        <FormField>
          <Dropdown
            label='類別'
            onChanged={(category)=> this.setState({category, dirtyCategory: true})}
            selectedKey={this.categoryKeyFromProps()}
            options={Object.keys(categories).map((key)=> {
              return {key: categories[key].uuid, text: categories[key].name};
            })}
          />
        </FormField>
        <FormField>
          <TextField
            type='number'
            label='金額'
            step='any'
            value={this.state.amount}
            onChanged={(amount)=> this.setState({amount})}
          />
        </FormField>
        <FormField>
          <TextField
            type='text'
            label='內容（唔填都得）'
            autoCapitalize={false}
            value={this.state.details}
            onChanged={(details)=> this.setState({details})}
          />
        </FormField>
        <FormField style={{textAlign: 'center'}}>
          <PrimaryButton
            style={ButtonStyle}
            onClick={this.handleAddOutcome}
            type='button'>
            支出
          </PrimaryButton>
          <DefaultButton
            style={ButtonStyle}
            onClick={this.handleAddIncome}
            type='button'>
            收入
          </DefaultButton>
        </FormField>
      </section>
    );
  }
}

ExpenseForm.propTypes = {
  categories: PropTypes.object.isRequired,
  handleAddRecord: PropTypes.func.isRequired,
  handleFetchRecords: PropTypes.func.isRequired,
  handleInitHoodie: PropTypes.func.isRequired
}

export default ExpenseForm;

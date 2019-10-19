import React, { Component } from "react";
import { connect } from "react-redux";
import Aux from "../../hoc/Auxiliary";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "./../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "./../../withErrorHandler/withErrorHander";
import * as actions from "../../store/actions/";

class BurgerBuilder extends Component {
	state = {
		purchaseAble: false,
		purchasing: false
	};

	componentDidMount() {
		this.props.onInitIngredients();
	}

	updatePurchaseState = ingredients => {
		const sum = Object.keys(ingredients)
			.map(igKey => {
				return ingredients[igKey];
			})
			.reduce((sum, el) => sum + el, 0);

		return sum > 0;
	};

	purchaseHandle = () => {
		this.setState({ purchasing: true });
	};

	purchaseCancelHandler = () => {
		this.setState({ purchasing: false });
	};

	continuePurchaseHandler = () => {
		this.props.onInitPurchase();
		this.props.history.push({ pathname: "/checkout" });
	};

	render() {
		const disabledInfo = {
			...this.props.ings
		};

		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0;
		}

		let orderSummary = null;

		let burger = this.props.error ? (
			<p>Ingredients can't be loaded</p>
		) : (
			<Spinner />
		);

		if (this.props.ings) {
			burger = (
				<Aux>
					<Burger ingredients={this.props.ings} />
					<BuildControls
						price={this.props.price}
						ingredientAdded={this.props.onIngredientAdded}
						ingredientRemoved={this.props.onIngredientRemoved}
						disabled={this.disabledInfo}
						purchaseAble={this.updatePurchaseState(this.props.ings)}
						purchase={this.purchaseHandle}
					/>
				</Aux>
			);

			orderSummary = (
				<OrderSummary
					ingredients={this.props.ings}
					cancelOrder={this.purchaseCancelHandler}
					price={this.props.price}
					continueOrder={this.continuePurchaseHandler}
				/>
			);
		}

		return (
			<Aux>
				<Modal
					modalClosed={this.purchaseCancelHandler}
					show={this.state.purchasing}
				>
					{orderSummary}
				</Modal>
				{burger}
			</Aux>
		);
	}
}

const mapStateToProps = state => {
	return {
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		error: state.burgerBuilder.error
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onIngredientAdded: ingName => dispatch(actions.addIngredient(ingName)),
		onIngredientRemoved: ingName =>
			dispatch(actions.removeIngredient(ingName)),
		onInitIngredients: () => dispatch(actions.initIngredients()),
		onInitPurchase: () => dispatch(actions.purchaseInit())
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));

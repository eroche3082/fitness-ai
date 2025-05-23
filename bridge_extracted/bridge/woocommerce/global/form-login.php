<?php
/**
 * Login form
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/global/form-login.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 * @package 	WooCommerce/Templates
 * @version     9.2.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if ( is_user_logged_in() ) {
	return;
}

?>
<?php /*** Our code modification inside Woo template (Classes for html elements, placeholder for input fields and remember link position ) ***/ ?>

<form class="woocomerce-form woocommerce-form-login login check-login" method="post" <?php if ( $hidden ) echo 'style="display:none;"'; ?>>
	
	<?php do_action( 'woocommerce_login_form_start' ); ?>
	
	<div class="login-entrance-text">
		<?php if ( $message ) echo wpautop( wptexturize( $message ) ); ?>
	</div>
	
	<p class="form-row form-row-first">
		<input type="text" placeholder="<?php esc_html_e( 'Username or email', 'bridge' ); ?>" class="input-text placeholder" name="username" id="username" />
	</p>
	<p class="form-row form-row-last">
		<input class="input-text placeholder woocommerce-Input" placeholder="<?php esc_html_e( 'Password', 'bridge' ); ?>" type="password" name="password" id="password" />
	</p>
	<div class="clear"></div>

	<?php do_action( 'woocommerce_login_form' ); ?>

	<p class="form-row">
		<label class="woocommerce-form__label woocommerce-form__label-for-checkbox inline woo-my-account-rememberme">
			<input class="woocommerce-form__input woocommerce-form__input-checkbox" name="rememberme" type="checkbox" id="rememberme" value="forever" /> <span><?php esc_html_e( 'Remember me', 'bridge' ); ?></span>
		</label>
		<?php wp_nonce_field( 'woocommerce-login' ); ?>
		<input type="hidden" name="redirect" value="<?php echo esc_url( $redirect ) ?>" />
		<input type="submit" class="button<?php echo esc_attr( wc_wp_theme_get_element_class_name( 'button' ) ? ' ' . wc_wp_theme_get_element_class_name( 'button' ) : '' ); ?>" name="login" value="<?php esc_attr_e( 'Login', 'bridge' ); ?>" />
		<a class="lost_password" href="<?php echo esc_url( wp_lostpassword_url() ); ?>"><?php esc_html_e( 'Lost your password?', 'bridge' ); ?></a>
	</p>

	<div class="clear"></div>

	<?php do_action( 'woocommerce_login_form_end' ); ?>

</form>

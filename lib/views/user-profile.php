<?php
/**
 * @var boolean $show_in_admin
 */
?>
<h2><?php _e('Assistant', 'fl-assistant') ?></h2>
<table class="form-table" role="presentation">
	<tbody>
	<tr class="user-show-assistant-in-admin-wrap">
		<th scope="row"><?php _e('Show in Admin', 'fl-assistant') ?></th>
		<td>
			<label for="show_assistant_in_admin">
				<input type="checkbox"
				       id="show_assistant_in_admin"
				       name="show_assistant_in_admin" <?php echo $show_in_admin ? 'checked' : null ?> >
				<?php _e('Show Assistant UI in the WordPress Admin', 'fl-assistant') ?>
			</label>
		</td>
	</tr>
	<tr class="user-fl-asst-hidden-ui-wrap">
		<th>
			<label for="fl_asst_hidden_ui"><?php _e('Show when hidden', 'fl-assistant') ?></label>
		</th>
		<td>
			<select name="fl_asst_hidden_ui" id="fl_asst_hidden_ui">
				<option value=""><?php _e('Button (Default)', 'fl-assistant') ?></option>
				<option value="admin_bar"><?php _e('Admin Bar Item', 'fl-assistant') ?></option>
			</select>
		</td>
	</tr>
	</tbody>
</table>

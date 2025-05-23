<?php
include_once 'header.php';
?>


<div class="card shadow mb-4">
    <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary float-left" data-localize="rooms"></h6>
        <?php if ($adminTenant || $masterTenant) { ?>
        <div class="float-right"><a href="videoai.php" class=""><i class="fas fa-plus fa-2x text-300"></i></a></div>
        <?php } ?>
    </div>
    <div class="card-body">
        <div class="table-responsive">

            <table class="table table-bordered" id="rooms_table" width="100%" cellspacing="0">
                <thead>
                    <tr>
                        <th class="text-center" data-localize="room"></th>
                        <th class="text-center" data-localize="agent"></th>
                        <th class="text-center" data-localize="agent_url"></th>
                        <th class="text-center" data-localize="action">Action</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>

            </table>
        </div>

    </div>

</div>

<?php
include_once 'footer.php';
?>

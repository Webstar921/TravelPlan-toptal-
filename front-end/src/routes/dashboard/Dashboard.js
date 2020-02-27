import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Table } from 'reactstrap';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { pick } from 'lodash';
import { withRouter } from 'react-router';
import { getFutureRecords, deleteRecord } from '../../redux/modules/record';
import { recordsListSelector, recordsParamsSelector, profileSelector } from '../../redux/selectors';
import { isAdmin } from '../../helpers/roleHelpers';
import confirm from '../../components/ConfirmModal';
import Pagination from '../../components/Pagination';
import moment from 'moment';

class Dashboard extends Component {
  static propTypes = {
    deleteRecord: PropTypes.func,
    getFutureRecords: PropTypes.func,
    history: PropTypes.object,
    pagination: PropTypes.object,
    recordsList: PropTypes.array,
    profile: PropTypes.object,
  };

  componentDidMount() {
    const { getFutureRecords, params } = this.props;
    getFutureRecords({ params });
  }

  handleDeleteRecord = (id) => () => {
    const { deleteRecord, getFutureRecords, params } = this.props;
    confirm('Are you sure to delete the record?').then(
      () => {
        deleteRecord({
          id,
          success: () => getFutureRecords({ params })
        });
      }
    );
  }

  handlePagination = (pagination) => {
    const { getFutureRecords, params } = this.props;
    getFutureRecords({
      params: {
        ...pick(params, ['page', 'page_size']),
        ...pagination
      }
    });
  }

  displayDayCount = (startDate) => {
    if(moment(new Date()).isBefore(startDate))
      return moment(startDate).fromNow();
  }

  render() {
    const { params, profile, recordsList } = this.props;
    const pagination = pick(params, ['page', 'page_size', 'count']);

    return (
      <div>
        <h2 className='text-center mb-5'>Next Month Travel Records</h2>
        <Table striped responsive className='record-table'>
          <thead>
            <tr>
              <th className='text-center'>No</th>
              {isAdmin(profile) && <th className='text-center'>User</th>}
              <th className='text-center'>Destination</th>
              <th className='text-center'>Start Date</th>
              <th className='text-center'>End Date</th>
              <th className='text-center'>Comment</th>
              <th className='text-center'>After Days</th>
              <th className='text-right'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recordsList && recordsList.map((record, index) => (
              <tr key={index}>
                <th className='text-center' scope='row'>{index + 1}</th>
                {isAdmin(profile) && <td className='text-center'>{record.userName}</td>}
                <td className='text-center'>{record.destination}</td>
                <td className='text-center'>{moment(record.startDate).format('MM-DD-YYYY')}</td>
                <td className='text-center'>{moment(record.endDate).format('MM-DD-YYYY')}</td>
                <td className='text-center'>{record.comment}</td>
                <td className='text-center'>{this.displayDayCount(record.startDate)}</td>
                <td className='text-right'>
                  <Link className='btn btn-primary btn-sm' to={`/records/edit/${record._id}`}>
                    <FaRegEdit />
                  </Link>
                  {' '}
                  <Button color='danger' size='sm' onClick={this.handleDeleteRecord(record._id)}>
                    <FaRegTrashAlt />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Pagination pagination={pagination} setPagination={this.handlePagination} />
      </div>
    )
  }
}

const selector = createStructuredSelector({
  recordsList: recordsListSelector,
  params: recordsParamsSelector,
  profile: profileSelector,
});

const actions = {
  getFutureRecords,
  deleteRecord
};

export default compose(
  connect(selector, actions),
  withRouter
)(Dashboard);

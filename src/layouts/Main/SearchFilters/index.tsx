import {
  Box,
  Button,
  Collapse,
  Paper,
  Stack,
  StackProps,
  collapseClasses,
  styled,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { ResetQueryState, resetQuery } from '@octotread/services/search-query'
import { RootState } from '@octotread/services/store'
import { LanguageSelection } from './LanguageSelection'
import { TimeFilter } from './TimeFilter'
import { TopicFilter } from './TopicFilter'
import { useEffect, useState } from 'react'
// TODO: gut RHF for custom solution using yup + lodash
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ObjectSchema, object, string, array, number } from 'yup'
import { DateRange } from '@octotread/models/dateRange'
import { generateDateStartEnd } from '@octotread/utils/dates'
import { Input } from '@octotread/components/Input'
import { Icon } from '@iconify/react'

const FiltersPaper = styled(Paper)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(3),
  paddingInline: theme.spacing(2),
  color: theme.vars.palette.text.primary,
  width: '100%',
  border: `4px solid ${theme.palette.primary.main}`,
}))

const FiltersButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  bottom: '0',
  transform: 'translate(50%, 100%)',
  right: '50%',
  borderRadius: `0 0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px`,
  boxShadow: 'none',
  backgroundColor: theme.vars.palette.primary.main,
}))

const CustomCollapse = styled(Collapse)(() => ({
  [`& .${collapseClasses.wrapperInner}`]: {
    display: 'flex',
    justifyContent: 'center',
  },
}))

const DummyCollapse = styled(Collapse)(({ theme }) => ({
  position: 'absolute',
  top: '-0.5rem',
  width: '100%',
  zIndex: -1,
  backgroundColor: theme.palette.primary.main,
  borderRadius: `0 0 ${theme.spacing(1)} ${theme.spacing(1)}`,
}))

const schema: ObjectSchema<ResetQueryState> = object({
  searchText: string().optional(),
  dateRange: string<DateRange>().required(),
  language: array().of(string().required()).required(),
  topics: array().of(string().required()).required(),
  stars: number().required('Number should be provided').typeError('Number should be provided'),
  itemsPerPage: number()
    .required('Number should be provided')
    .typeError('Number should be provided')
    .min(6)
    .max(30),
})

type Props = StackProps

export function SearchFilters(props: Props) {
  const [showFilters, setShowFilters] = useState(false)

  const dispatch = useDispatch()

  const searchText = useSelector((state: RootState) => state.searchquery.searchText)
  const searchLanguages = useSelector((state: RootState) => state.searchquery.language)
  const searchStars = useSelector((state: RootState) => state.searchquery.stars)
  const searchDateRange = useSelector((state: RootState) => state.searchquery.dateRange)
  const searchTopics = useSelector((state: RootState) => state.searchquery.topics)
  const repoItemsPerPage = useSelector((state: RootState) => state.searchquery.itemsPerPage)

  const {
    control,
    trigger,
    formState: { isDirty, isValid, isSubmitSuccessful },
    getValues,
    handleSubmit,
    reset,
  } = useForm<ResetQueryState>({
    resolver: yupResolver(schema),
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      searchText: searchText,
      language: searchLanguages,
      stars: searchStars,
      dateRange: searchDateRange,
      itemsPerPage: repoItemsPerPage,
      topics: searchTopics,
    },
  })

  useEffect(() => {
    trigger()
  }, [trigger])

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ ...getValues() })
    }
  }, [isSubmitSuccessful, reset, getValues])

  const handleApplyClick = () => {
    const v = getValues()
    dispatch(
      resetQuery({
        state: {
          ...v,
          // react-hook-form does not have a way to automatically convert to int :(
          stars: parseInt(v.stars as unknown as string, 10),
          itemsPerPage: parseInt(v.itemsPerPage as unknown as string, 10),
        },
        newDateObj: generateDateStartEnd(v.dateRange),
      }),
    )
  }

  return (
    <Stack direction='column' sx={{ position: 'relative' }} {...props}>
      <CustomCollapse in={showFilters}>
        <FiltersPaper component={Stack} direction='column' spacing={3}>
          <Stack direction='row' justifyContent='space-between' spacing={3}>
            <Controller
              control={control}
              name='searchText'
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label='Search text'
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  placeholder='javascript'
                  tooltipText='Keywords to search in the repositories name, description and readme file.'
                  sx={{ flex: '0 1 20rem' }}
                />
              )}
            />

            <Stack direction='row' justifyContent='flex-end' spacing={3} flex='0 1 auto'>
              <Controller
                control={control}
                name='dateRange'
                render={({ field: { value, onChange } }) => (
                  <TimeFilter
                    value={value}
                    handleChange={(v) => onChange(v)}
                    containerProps={{ sx: { flex: '0 0 8rem' } }}
                  />
                )}
              />

              <Controller
                control={control}
                name='stars'
                render={({ field, fieldState }) => (
                  // TODO: only allow numbers to be entered
                  <Input
                    {...field}
                    label='Min stars'
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    sx={{ flex: '0 1 8rem' }}
                  />
                )}
              />

              <Controller
                control={control}
                name='itemsPerPage'
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    label='Items per page'
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    sx={{ flex: '0 1 10rem' }}
                  />
                )}
              />
            </Stack>
          </Stack>

          <Stack direction='row' alignItems='flex-end'>
            <Stack direction='row' flex='1' spacing={3}>
              <Controller
                control={control}
                name='language'
                render={({ field: { value, onChange } }) => (
                  <LanguageSelection
                    value={value}
                    handleValueChange={(l) => onChange(l)}
                    containerProps={{ sx: { flex: '0 0 30rem' } }}
                  />
                )}
              />

              <Controller
                control={control}
                name='topics'
                render={({ field: { onChange } }) => (
                  <TopicFilter
                    handleValueChange={(v) => onChange(v)}
                    containerProps={{ sx: { flex: '0 0 30rem' } }}
                  />
                )}
              />
            </Stack>

            <Box mr={2} mb={2}>
              {/* TODO: only enable button when form values have actually changed, not just simple dirty check. will require deep compare */}
              <Button
                variant='contained'
                disabled={!isValid || !isDirty}
                onClick={handleSubmit(handleApplyClick)}
              >
                Apply
              </Button>
            </Box>
          </Stack>
        </FiltersPaper>
      </CustomCollapse>
      <DummyCollapse in={showFilters} collapsedSize='calc(100% + 0.5rem)' />

      <FiltersButton
        variant='contained'
        endIcon={
          <Icon
            icon={
              showFilters ? 'material-symbols:arrow-drop-up' : 'material-symbols:arrow-drop-down'
            }
          />
        }
        onClick={() => setShowFilters((prev) => !prev)}
      >
        Show filters
      </FiltersButton>
    </Stack>
  )
}
